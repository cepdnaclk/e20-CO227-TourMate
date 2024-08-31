/*
Map used in SearchPlace page. 
*/

import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Box,
  Paper,
  Rating,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import "./Map.css";

const Map = ({
  setCoordinates,
  setBound,
  coordinates,
  places,
  setChildClicked,
}) => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  // Create a custom icon using LocationOn
  const locationIcon = L.divIcon({
    className: "custom-icon",
    html: `<div style="background: transparent; border: none; display: flex; justify-content: center; align-items: center;">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2C8.13 2 5 5.13 5 9C5 12.26 10 21 12 21C14 21 19 12.26 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.07 11.5 8.5 9.93 8.5 8C8.5 6.07 10.07 4.5 12 4.5C13.93 4.5 15.5 6.07 15.5 8C15.5 9.93 13.93 11.5 12 11.5Z" fill="red"/>
             </svg>
             
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
  const position = [coordinates.lat, coordinates.long];

  const mapRef = useRef(null); // Create a reference to the map

  const initialBoundsSet = useRef(false); // Track if initial bounds have been set
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(position); // Update the map center when coordinates change
    }
  }, [coordinates]);

  const isValidCoordinates =
    coordinates &&
    coordinates.lat !== undefined &&
    coordinates.long !== undefined;

  if (!isValidCoordinates) {
    return (
      <div className="loading">
        <CircularProgress size="5rem" />
      </div>
    );
  }

  //Detect when map zoom or scroll and updates map bound accordingly
  const MapEventHandler = () => {
    const map = useMapEvents({
      moveend: () => {
        debounceUpdateBounds();
      },
      zoomend: () => {
        debounceUpdateBounds();
      },
    });

    //Add delay to update bounds
    const debounceUpdateBounds = () => {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        const bounds = map.getBounds();
        const center = map.getCenter();

        // Only update coordinates if they have actually changed
        if (center.lat !== coordinates.lat || center.lng !== coordinates.long) {
          setCoordinates({ lat: center.lat, long: center.lng });
        }

        setBound(bounds);
      }, 2000); // Adjust the delay as needed
    };

    useEffect(() => {
      if (!initialBoundsSet.current) {
        const bounds = map.getBounds();
        setBound(bounds);
        initialBoundsSet.current = true; // Mark initial bounds as set
      }
    }, [map]);

    return null;
  };

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        maxZoom={15}
        minZoom={8}
        ref={mapRef} // Assign the map reference
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {places?.map((place, i) => {
          const lat = Number(place.latitude);
          const lng = Number(place.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            return (
              <Marker
                position={[lat, lng]}
                key={i}
                icon={locationIcon}
                eventHandlers={{
                  click: () => {
                    setChildClicked(i); // Update state when marker is clicked
                  },
                }}
              >
                <Popup>
                  {!isDesktop ? (
                    <Paper elevation={3} className="paper">
                      <Typography variant="subtitle2">{place.name}</Typography>
                    </Paper>
                  ) : (
                    <Paper elevation={3} className="paper">
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        className="typography"
                      >
                        {place.name}
                      </Typography>
                      <img
                        src={
                          place.photo
                            ? place.photo.images.large.url
                            : "No Photo"
                        }
                        alt={place.name}
                        className="pointer"
                        style={{ width: "auto", height: "auto" }}
                      />
                      <Rating
                        size="small"
                        value={Number(place.rating)}
                        readOnly
                      />
                    </Paper>
                  )}
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
        <MapEventHandler />
      </MapContainer>
    </Box>
  );
};

export default Map;
