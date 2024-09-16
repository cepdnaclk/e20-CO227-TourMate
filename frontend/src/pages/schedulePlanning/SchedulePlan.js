import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "./SchedulePlan.css";
import townBoundingBoxes from "./TownBoundingBox";
import { Box, Rating, Typography } from "@mui/material";
import { LocationOn } from "@mui/icons-material";

const SchedulePlan = () => {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState(["", "", "", "", ""]);
  const [waitingTimes, setWaitingTimes] = useState([0, 0, 0, 0, 0]);
  const [startDateTime, setStartDateTime] = useState("");
  const [reverseRoute, setReverseRoute] = useState(false);
  const [segmentDetails, setSegmentDetails] = useState([]);
  const [arrivalTable, setArrivalTable] = useState([]);
  const [summary, setSummary] = useState("");
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  const token = localStorage.getItem("token");

  const [passingTowns, setPassingTowns] = useState([]);
  const [nearbyTowns, setNearbyTowns] = useState([]);
  const [bookmarkPlaces, setBookmarkPlaces] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchBookmarkPlaces = async () => {
      try {
        const response = await fetch(
          "http://localhost:1200/bookmarks/getplaces",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBookmarkPlaces(data);
        } else {
          console.log("Error fetching bookmark places");
        }
      } catch (error) {
        console.log("Something went wrong");
      }
    };

    fetchBookmarkPlaces();
  }, []);

  //BookmarkCard function
  const handleBookmarkClick = (bookmark) => {
    console.log(bookmark);
  };

  useEffect(() => {
    mapRef.current = L.map("map").setView([7.8731, 80.7718], 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  const handleLocationInput = (inputId, value) => {
    if (value.length > 1) {
      fetch(
        `http://localhost:1200/api/destinations/suggestions?query=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch suggestions");
          return response.json();
        })
        .then((suggestions) => {
          // Update the datalist based on the suggestions
          const datalist = document.getElementById(`${inputId}Suggestions`);
          datalist.innerHTML = "";

          suggestions.forEach((suggestion) => {
            const option = document.createElement("option");
            option.value = suggestion.destinationName;
            datalist.appendChild(option);
          });
        })
        .catch((error) => console.error("Error fetching suggestions:", error));
    }
  };

  const handleStopInput = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);

    handleLocationInput(`stop${index + 1}`, value);
  };

  // Handle waiting time input for dynamic stops
  const handleWaitingTimeInput = (index, value) => {
    const newWaitingTimes = [...waitingTimes];
    newWaitingTimes[index] = value;
    setWaitingTimes(newWaitingTimes);
  };

  // Handle reverse route toggle (start as destination)
  const handleReverseRouteChange = () => {
    setReverseRoute(!reverseRoute);

    // When reverse route is enabled, set destination to start location
    if (!reverseRoute) {
      setDestination(start);
    } else {
      setDestination("");
    }
  };

  // Sync destination when start changes if reverse route is enabled
  const handleStartInput = (value) => {
    setStart(value);
    if (reverseRoute) {
      setDestination(value);
    }
  };

  const findRoute = () => {
    const stopsToFetch = stops.filter((stop) => stop.trim() !== "");
    const locations = [start, ...stopsToFetch, destination];
    setCount(count + 1); //Count to render which part

    const locationPromises = locations.map((loc) =>
      fetch(
        `http://localhost:1200/api/destinations/coordinates?name=${encodeURIComponent(
          loc
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch coordinates");
          return response.json();
        })
        .then((data) => ({
          name: loc,
          lat: data.latitude,
          lon: data.longitude,
        }))
    );

    Promise.all(locationPromises)
      .then((locationsData) => {
        // Once you have all the locations (finalWaypoints), you can calculate the route
        const finalWaypoints = locationsData; // Store the resolved locations as finalWaypoints

        // Now calculate towns along the route and nearby towns
        const passingTowns = getTownsAlongRoute(finalWaypoints);
        const nearbyTowns = getNearbyTowns(finalWaypoints);

        // Display the towns
        displayTowns(passingTowns, "Passing Towns");
        displayTowns(nearbyTowns, "Nearby Towns");

        // Calculate the route based on the fetched locations and other parameters
        calculateContinuousRoute(
          finalWaypoints,
          waitingTimes,
          new Date(startDateTime)
        );
      })
      .catch((error) => console.error("Error fetching geocoding data:", error));
  };

  const calculateContinuousRoute = (
    waypoints,
    waitingTimes,
    startDateTimeValue
  ) => {
    // Remove any previous routing controls from the map
    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    // Intermediate stops for TSP
    const stopsWithTimes = waypoints.slice(1, -1).map((stop, index) => ({
      stop,
      waitingTime: waitingTimes[index],
    }));

    // Solve the TSP to get the optimal route
    let optimalStopsWithTimes = solveTSPForStopsWithTimes(
      stopsWithTimes,
      waypoints[0],
      waypoints[waypoints.length - 1]
    );

    // Clean the stops to ensure no duplicated destination
    optimalStopsWithTimes = cleanStopsWithTimes(
      optimalStopsWithTimes,
      waypoints[waypoints.length - 1]
    );

    // Final reordered waypoints and waiting times
    const finalWaypoints = [
      waypoints[0],
      ...optimalStopsWithTimes.map((pair) => pair.stop),
    ];
    const finalWaitingTimes = [
      waitingTimes[0],
      ...optimalStopsWithTimes.map((pair) => pair.waitingTime),
    ];

    // Get passing and nearby towns
    const passingTowns = getTownsAlongRoute(finalWaypoints);
    const nearbyTowns = getNearbyTowns(finalWaypoints);

    // Display the towns in React components (instead of direct DOM manipulation)
    displayTowns(passingTowns, "Passing Towns");
    displayTowns(nearbyTowns, "Nearby Towns");

    // Create routing control for the map using leaflet routing
    routingControlRef.current = L.Routing.control({
      waypoints: finalWaypoints.map((wp) => L.latLng(wp.lat, wp.lon)),
      routeWhileDragging: false,
      createMarker: () => null, // Prevent markers
    })
      .on("routesfound", (e) => {
        const routes = e.routes[0];
        const totalTravelTime = routes.summary.totalTime;
        const totalDistance = routes.summary.totalDistance / 1000;
        handleRouteFound(
          finalWaypoints,
          finalWaitingTimes,
          totalTravelTime,
          totalDistance,
          startDateTimeValue
        );
      })
      .on("routingerror", (error) => {
        console.error("Routing error:", error);
        alert("An error occurred while calculating the route.");
      })
      .addTo(mapRef.current);
  };

  // Function to clean the stops and remove any duplicate destinations
  const cleanStopsWithTimes = (orderedStopsWithTimes, destination) => {
    const cleanedStops = [...orderedStopsWithTimes];

    // Ensure destination is only added once at the end if it is not already included
    if (
      cleanedStops.length === 0 ||
      cleanedStops[cleanedStops.length - 1].stop !== destination
    ) {
      cleanedStops.push({ stop: destination, name: "Destination" });
    }

    return cleanedStops;
  };

  const handleRouteFound = (
    finalWaypoints,
    finalWaitingTimes,
    totalTravelTime,
    totalDistance,
    startDateTimeValue
  ) => {
    let currentDateTime = new Date(startDateTimeValue);
    let currentDayTime =
      currentDateTime.getHours() + currentDateTime.getMinutes() / 60;
    const dailyStartTime = 7;
    const dailyEndTime = 20;

    setSegmentDetails([]); // Clear previous details
    setArrivalTable([]); // Clear previous table entries
    setSummary(""); // Clear previous summary

    const overallSummary = {
      totalDistance: totalDistance.toFixed(2),
      totalTime: (totalTravelTime / 60).toFixed(2), // Convert time to minutes
    };
    setSummary(overallSummary); // Set the summary

    let accumulatedTime = 0;

    finalWaypoints.forEach((waypoint, i) => {
      if (i < finalWaypoints.length - 1) {
        const from = finalWaypoints[i];
        const to = finalWaypoints[i + 1];
        const waitingTime = finalWaitingTimes[i] || 0;

        const segmentDistance = distanceBetweenCoords(from, to);
        const segmentTravelTime =
          (totalTravelTime / totalDistance) * segmentDistance;

        const departureTime = new Date(currentDateTime);

        accumulatedTime += segmentTravelTime;
        if (waitingTime > 0) {
          accumulatedTime += waitingTime * 60; // Convert minutes to seconds
        }

        let segmentEndHour = currentDayTime + segmentTravelTime / 3600;

        if (segmentEndHour > dailyEndTime) {
          currentDateTime.setDate(currentDateTime.getDate() + 1); // Move to the next day
          currentDateTime.setHours(dailyStartTime, 0, 0); // Set to start time (7:00 AM)
          currentDayTime = dailyStartTime;
          segmentEndHour = dailyStartTime + segmentTravelTime / 3600; // Recalculate
        }

        currentDayTime += segmentTravelTime / 3600;
        currentDateTime.setSeconds(
          currentDateTime.getSeconds() + segmentTravelTime + waitingTime * 60
        );
        const arrivalTime = new Date(currentDateTime);

        const formattedDepartureTime = departureTime.toLocaleString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const formattedArrivalTime = arrivalTime.toLocaleString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        // Add segment details
        setSegmentDetails((prevDetails) => [
          ...prevDetails,
          {
            from: from.name,
            to: to.name,
            distance: segmentDistance.toFixed(2),
            time: (segmentTravelTime / 60).toFixed(2),
            waitingTime,
          },
        ]);

        // Add arrival table data
        setArrivalTable((prevTable) => [
          ...prevTable,
          {
            from: from.name,
            to: to.name,
            distance: segmentDistance.toFixed(2),
            departure: formattedDepartureTime,
            arrival: formattedArrivalTime,
          },
        ]);
      }
    });
  };

  const TSPPlanner = ({ locations }) => {
    const [optimalOrder, setOptimalOrder] = useState([]);

    useEffect(() => {
      if (locations.length > 0) {
        const optimalPath = solveTSP(locations);
        setOptimalOrder(optimalPath);
      }
    }, [locations]);

    // Traveling Salesman Problem (TSP) Solver function
    const solveTSP = (locations) => {
      const numLocations = locations.length;
      const distances = Array(numLocations)
        .fill()
        .map(() => Array(numLocations).fill(Infinity));

      // Calculate the distance matrix between each pair of locations
      for (let i = 0; i < numLocations; i++) {
        for (let j = i + 1; j < numLocations; j++) {
          const dist = distanceBetweenCoords(locations[i], locations[j]);
          distances[i][j] = dist;
          distances[j][i] = dist;
        }
      }

      const memo = {};
      const visitedAll = (1 << numLocations) - 1;

      // TSP dynamic programming function
      function tsp(mask, pos) {
        if (mask === visitedAll) {
          return distances[pos][0];
        }
        if (memo[`${mask}-${pos}`] !== undefined) {
          return memo[`${mask}-${pos}`];
        }
        let result = Infinity;
        for (let next = 0; next < numLocations; next++) {
          if ((mask & (1 << next)) === 0) {
            const newResult =
              distances[pos][next] + tsp(mask | (1 << next), next);
            result = Math.min(result, newResult);
          }
        }
        memo[`${mask}-${pos}`] = result;
        return result;
      }

      // Reconstruct the path
      function findPath(mask, pos) {
        if (mask === visitedAll) return [0];
        let result = Infinity;
        let bestNext = -1;
        for (let next = 0; next < numLocations; next++) {
          if ((mask & (1 << next)) === 0) {
            const newResult =
              distances[pos][next] + tsp(mask | (1 << next), next);
            if (newResult < result) {
              result = newResult;
              bestNext = next;
            }
          }
        }
        return [bestNext, ...findPath(mask | (1 << bestNext), bestNext)];
      }

      const order = findPath(1, 0);
      return order.map((index) => locations[index]);
    };

    return (
      <div>
        <h2>Optimal Route</h2>
        <ul>
          {optimalOrder.map((location, index) => (
            <li key={index}>
              Stop {index + 1}: Latitude: {location[0]}, Longitude:{" "}
              {location[1]}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const solveTSPForStopsWithTimes = (stopsWithTimes, start, destination) => {
    let remainingStops = stopsWithTimes.slice();
    let orderedStopsWithTimes = [];
    let currentLocation = start;

    console.log("Initial remaining stops:", remainingStops);
    console.log("Starting location:", start);
    console.log("Destination:", destination);

    remainingStops = remainingStops.filter((pair) => {
      const isDestination = pair.stop === destination;
      console.log(`Filtering ${pair.stop}, is destination: ${isDestination}`);
      return !isDestination;
    });

    console.log(
      "Filtered remaining stops (without destination):",
      remainingStops
    );

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

      console.log("Current ordered stops:", orderedStopsWithTimes);

      remainingStops = remainingStops.filter((pair) => pair !== closestPair);
    }
    if (
      orderedStopsWithTimes.length === 0 ||
      orderedStopsWithTimes[orderedStopsWithTimes.length - 1].stop !==
        destination
    ) {
      orderedStopsWithTimes.push({ stop: destination, name: "Destination" });
      console.log("Added destination:", destination);
    } else {
      console.log("Destination is already the last stop, no need to add.");
    }

    console.log("Final ordered stops:", orderedStopsWithTimes);

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
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getTownsAlongRoute = (waypoints) => {
    return waypoints
      .filter((waypoint) =>
        Object.keys(townBoundingBoxes).some((town) =>
          isWithinBounds(waypoint, townBoundingBoxes[town])
        )
      )
      .map((waypoint) => waypoint.name);
  };

  const getNearbyTowns = (waypoints) => {
    return Object.keys(townBoundingBoxes).filter((town) =>
      waypoints.some(
        (waypoint) => isWithinBounds(waypoint, townBoundingBoxes[town], 0.05) // Adjust buffer if needed
      )
    );
  };

  const isWithinBounds = (coord, boundingBox, buffer = 0) => {
    return (
      coord.lat >= boundingBox.south - buffer &&
      coord.lat <= boundingBox.north + buffer &&
      coord.lon >= boundingBox.west - buffer &&
      coord.lon <= boundingBox.east + buffer
    );
  };

  const displayTowns = (towns, type) => {
    if (type === "Passing Towns") {
      setPassingTowns(towns);
    } else if (type === "Nearby Towns") {
      setNearbyTowns(towns);
    }
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
              onInput={(e) => handleLocationInput("start", e.target.value)}
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
              onInput={(e) =>
                handleLocationInput("destination", e.target.value)
              }
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
              onChange={handleReverseRouteChange}
            />{" "}
            Use Destination as Start Location
          </label>
        </div>
        <Typography variant="h5">Your Bookmarks:</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {bookmarkPlaces.length > 0 &&
            bookmarkPlaces.map((bookmark, index) => (
              <div
                key={index}
                className="bookmark-card"
                onClick={() => handleBookmarkClick(bookmark)}
              >
                <img
                  src={bookmark.imgUrl}
                  alt={bookmark.name}
                  className="bookmark-image"
                />
                <div className="bookmark-details">
                  <Box>
                    <h4>{bookmark.name}</h4>
                    <Rating
                      name={`bookmark-rating-${index}`}
                      value={bookmark.rating}
                      precision={0.5} // Allows half-star increments
                      readOnly
                      size="small"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {/* <LocationOn fontSize="small" /> */}
                    <Typography sx={{ ml: 0.5 }}>{bookmark.city}</Typography>
                  </Box>
                </div>
              </div>
            ))}
        </Box>
        {stops.map((stop, index) => (
          <div key={index}>
            <label htmlFor={`stop${index + 1}`}>Stop {index + 1}:</label>
            <input
              type="text"
              id={`stop${index + 1}`}
              value={stop || ""}
              onInput={(e) => handleStopInput(index, e.target.value)}
              list={`stop${index + 1}Suggestions`}
              placeholder="Enter stop location"
            />
            <datalist id={`stop${index + 1}Suggestions`}></datalist>
            <div
              className="waiting-time"
              style={{ display: stop ? "block" : "none" }}
            >
              <label>Waiting Time:</label>
              <input
                type="radio"
                name={`waitingTime${index + 1}`}
                value="15"
              />{" "}
              15 min
              <input
                type="radio"
                name={`waitingTime${index + 1}`}
                value="30"
              />{" "}
              30 min
              <input
                type="radio"
                name={`waitingTime${index + 1}`}
                value="60"
              />{" "}
              1 hour
            </div>
          </div>
        ))}
        <button id="findRoute" onClick={findRoute}>
          Schedule
        </button>
        <div id="map" style={{ height: "400px" }}></div>
        <div id="segmentDetails">
          <h2>Segment Details</h2>
          {/* <div className="towns">
            <h4>Passing Towns</h4>
            {passingTowns.length > 0 ? (
              <p>{passingTowns.join(", ")}</p>
            ) : (
              <p>No passing towns found.</p>
            )}
          </div> */}

          <div className="towns">
            <h4>Nearby Towns</h4>
            {nearbyTowns.length > 0 ? (
              <p>{nearbyTowns.join(", ")}</p>
            ) : (
              <p>No nearby towns found.</p>
            )}
          </div>
          <div>
            {segmentDetails.map((segment, index) => (
              <div key={index}>
                <h4>
                  From {segment.from} to {segment.to}
                </h4>
                <p>
                  <strong>Distance:</strong> {segment.distance} km
                </p>
                <p>
                  <strong>Time:</strong> {segment.time} minutes
                </p>
                <p>
                  <strong>Waiting Time:</strong> {segment.waitingTime} minutes
                </p>
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
          <p>
            <strong>Total Distance:</strong> {summary.totalDistance} km
          </p>
          <p>
            <strong>Total Time:</strong> {summary.totalTime} minutes
          </p>
        </div>
        )
      </div>
    </div>
  );
};

const bookmarks = ({ bookmarkPlaces }) => {
  return (
    <div>
      <h1>Bookmarks</h1>
    </div>
  );
};

export default SchedulePlan;
