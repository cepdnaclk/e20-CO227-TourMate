import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import "./SchedulePlan.css";

const SchedulePlan = () => {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [stops, setStops] = useState(['', '', '', '', '']);
  const [waitingTimes, setWaitingTimes] = useState([0, 0, 0, 0, 0]);
  const [startDateTime, setStartDateTime] = useState('');
  const [reverseRoute, setReverseRoute] = useState(false);
  const [segmentDetails, setSegmentDetails] = useState([]);
  const [arrivalTable, setArrivalTable] = useState([]);
  const [summary, setSummary] = useState('');
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  const token = localStorage.getItem('token'); // Assuming JWT token is stored in localStorage

  useEffect(() => {
    mapRef.current = L.map('map').setView([7.8731, 80.7718], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current);
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  const handleLocationInput = (inputId, value) => {
    if (value.length > 1) {
      fetch(`http://localhost:1200/api/destinations/suggestions?query=${value}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Add Authorization header
        }
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch suggestions');
          return response.json();
        })
        .then((suggestions) => {
          // Update the datalist based on the suggestions
          const datalist = document.getElementById(`${inputId}Suggestions`);
          datalist.innerHTML = ''; // Clear previous options
  
          suggestions.forEach((suggestion) => {
            const option = document.createElement('option');
            option.value = suggestion.destinationName; // Use destinationName from response
            datalist.appendChild(option);
          });
        })
        .catch((error) => console.error('Error fetching suggestions:', error));
    }
  };
  

  const handleStopInput = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleWaitingTimeInput = (index, value) => {
    const newWaitingTimes = [...waitingTimes];
    newWaitingTimes[index] = parseInt(value);
    setWaitingTimes(newWaitingTimes);
  };

  const findRoute = () => {
    const stopsToFetch = stops.filter((stop) => stop.trim() !== '');
    const locations = [start, ...stopsToFetch, destination];
    const locationPromises = locations.map((loc) =>
      fetch(`http://localhost:1200/api/destinations/coordinates?name=${encodeURIComponent(loc)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => {
          if (!response.ok) throw new Error('Failed to fetch coordinates');
          return response.json();
        })
        .then((data) => ({ name: loc, lat: data.latitude, lon: data.longitude }))
    );
    Promise.all(locationPromises)
      .then((locationsData) => {
        calculateContinuousRoute(locationsData, waitingTimes, new Date(startDateTime));
      })
      .catch((error) => console.error('Error fetching geocoding data:', error));
  };

  const calculateContinuousRoute = (waypoints, waitingTimes, startDateTimeValue) => {
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    const stopsWithTimes = waypoints.slice(1, -1).map((stop, index) => ({
      stop,
      waitingTime: waitingTimes[index],
    }));

    const optimalStopsWithTimes = solveTSPForStopsWithTimes(stopsWithTimes, waypoints[0], waypoints[waypoints.length - 1]);

    const finalWaypoints = [waypoints[0], ...optimalStopsWithTimes.map((pair) => pair.stop), waypoints[waypoints.length - 1]];

    routingControlRef.current = L.Routing.control({
      waypoints: finalWaypoints.map((wp) => L.latLng(wp.lat, wp.lon)),
      routeWhileDragging: false,
      createMarker: () => null,
    })
      .on('routesfound', (e) => {
        const routes = e.routes[0];
        const totalTravelTime = routes.summary.totalTime;
        const totalDistance = routes.summary.totalDistance / 1000;
        handleRouteFound(finalWaypoints, totalTravelTime, totalDistance, startDateTimeValue);
      })
      .on('routingerror', (error) => {
        console.error('Routing error:', error);
        alert('An error occurred while calculating the route.');
      })
      .addTo(mapRef.current);
  };

  const handleRouteFound = (finalWaypoints, totalTravelTime, totalDistance, startDateTimeValue) => {
    let currentDateTime = new Date(startDateTimeValue);
    let currentDayTime = currentDateTime.getHours() + currentDateTime.getMinutes() / 60;
    const dailyStartTime = 7;
    const dailyEndTime = 20;

    setSegmentDetails([]);
    setArrivalTable([]);
    setSummary('');

    const overallSummary = {
      totalDistance: totalDistance.toFixed(2),
      totalTime: (totalTravelTime / 60).toFixed(2)
    };
    setSummary(overallSummary);

    let accumulatedTime = 0;

    finalWaypoints.forEach((waypoint, i) => {
      if (i < finalWaypoints.length - 1) {
        const from = finalWaypoints[i];
        const to = finalWaypoints[i + 1];
        const waitingTime = waitingTimes[i] || 0;

        const segmentDistance = distanceBetweenCoords(from, to);
        const segmentTravelTime = (totalTravelTime / totalDistance) * segmentDistance;

        const departureTime = new Date(currentDateTime);

        accumulatedTime += segmentTravelTime;
        if (waitingTime > 0) {
          accumulatedTime += waitingTime * 60;
        }

        let segmentEndHour = currentDayTime + segmentTravelTime / 3600;

        if (segmentEndHour > dailyEndTime) {
          currentDateTime.setDate(currentDateTime.getDate() + 1); // Move to the next day
          currentDateTime.setHours(dailyStartTime, 0, 0); // Set time to 7:00 AM
          currentDayTime = dailyStartTime;
          segmentEndHour = dailyStartTime + segmentTravelTime / 3600; // Recalculate segment end time
        }

        currentDayTime += segmentTravelTime / 3600;
        currentDateTime.setSeconds(currentDateTime.getSeconds() + segmentTravelTime + waitingTime * 60);
        const arrivalTime = new Date(currentDateTime);

        const formattedDepartureTime = departureTime.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const formattedArrivalTime = arrivalTime.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        setSegmentDetails((prevDetails) => [
          ...prevDetails,
          { from: from.name, to: to.name, distance: segmentDistance.toFixed(2), time: (segmentTravelTime / 60).toFixed(2), waitingTime }
        ]);

        setArrivalTable((prevTable) => [
          ...prevTable,
          { from: from.name, to: to.name, distance: segmentDistance.toFixed(2), departure: formattedDepartureTime, arrival: formattedArrivalTime }
        ]);
      }
    });
  };

  const solveTSPForStopsWithTimes = (stopsWithTimes, start, destination) => {
    let remainingStops = stopsWithTimes.slice();
    let orderedStopsWithTimes = [];
    let currentLocation = start;

    while (remainingStops.length > 0) {
      let closestStop = null;
      let shortestDistance = Infinity;
      let closestPair = null;

      remainingStops.forEach((pair) => {
        const distance = distanceBetweenCoords(currentLocation, pair.stop);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          closestStop = pair.stop;
          closestPair = pair;
        }
      });

      orderedStopsWithTimes.push(closestPair);
      currentLocation = closestStop;
      remainingStops = remainingStops.filter((pair) => pair !== closestPair);
    }

    return orderedStopsWithTimes;
  };

  const distanceBetweenCoords = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLng = ((coord2.lon - coord1.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div>
      <h1>Schedule Planner</h1>
    <div className="container">
      <div className="input-container">
        <div>
          <label htmlFor="start">Start Location:</label>
          <input
            type="text"
            id="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            list="startSuggestions"
            onInput={(e) => handleLocationInput('start', e.target.value)} // Pass the input value here
          />
          <datalist id="startSuggestions"></datalist>
        </div>
        <div>
          <label htmlFor="startDateTime">Journey Start Time & Date:</label>
          <input
            type="datetime-local"
            id="startDateTime"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            list="destinationSuggestions"
            onInput={(e) => handleLocationInput('destination', e.target.value)} // Pass the input value here
          />
          <datalist id="destinationSuggestions"></datalist>
        </div>
      </div>
        <div className="checkbox-container">
          <label>
            <input
              type="checkbox"
              id="reverseRoute"
              checked={reverseRoute}
              onChange={() => setReverseRoute(!reverseRoute)}
            />{' '}
            Use Destination as Start Location
          </label>
        </div>

        {stops.map((stop, index) => (
          <div key={index}>
            <label htmlFor={`stop${index + 1}`}>Stop {index + 1}:</label>
            <input
              type="text"
              id={`stop${index + 1}`}
              value={stop}
              onChange={(e) => handleStopInput(index, e.target.value)}
              list={`stop${index + 1}Suggestions`}
              placeholder="Enter stop location"
            />
            <datalist id={`stop${index + 1}Suggestions`}></datalist>
            <div className="waiting-time" style={{ display: stop ? 'block' : 'none' }}>
              <label>Waiting Time:</label>
              <input
                type="radio"
                name={`waitingTime${index + 1}`}
                value="15"
                onChange={(e) => handleWaitingTimeInput(index, e.target.value)}
              />{' '}
              15 min
              <input
                type="radio"
                name={`waitingTime${index + 1}`}
                value="30"
                onChange={(e) => handleWaitingTimeInput(index, e.target.value)}
              />{' '}
              30 min
              <input
                type="radio"
                name={`waitingTime${index + 1}`}
                value="60"
                onChange={(e) => handleWaitingTimeInput(index, e.target.value)}
              />{' '}
              1 hour
            </div>
          </div>
        ))}

        <button id="findRoute" onClick={findRoute}>
          Schedule
        </button>

        <div id="map" style={{ height: '400px' }}></div>

        <div id="segmentDetails">
          <h2>Segment Details</h2>
          <div>
            {segmentDetails.map((segment, index) => (
              <div key={index}>
                <h4>From {segment.from} to {segment.to}</h4>
                <p><strong>Distance:</strong> {segment.distance} km</p>
                <p><strong>Time:</strong> {segment.time} minutes</p>
                <p><strong>Waiting Time:</strong> {segment.waitingTime} minutes</p>
              </div>
            ))}
          </div>
        </div>

        <div id="arrivalTableContainer">
          <h2>Schedule Table</h2>
          <table id="arrivalTable">
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Distance</th>
                <th>Estimated Departure Time</th>
                <th>Estimated Arrival Time</th>
              </tr>
            </thead>
            <tbody>
              {arrivalTable.map((row, index) => (
                <tr key={index}>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>{row.distance} km</td>
                  <td>{row.departure}</td>
                  <td>{row.arrival}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div id="summaryDiv">
          <h3>Overall Summary</h3>
          <p><strong>Total Distance:</strong> {summary.totalDistance} km</p>
          <p><strong>Total Time:</strong> {summary.totalTime} minutes</p>
        </div>
      </div>
    </div>
  );
};

export default SchedulePlan;
