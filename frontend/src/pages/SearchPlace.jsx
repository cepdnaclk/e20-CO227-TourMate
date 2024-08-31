import "../App.css";
import { CssBaseline, Grid } from "@mui/material";
import SearchHeader from "../components/Header/SearchHeader";
import Map from "../components/Map/Map";
import List from "../components/List/List";
import { getPlaceData } from "../api";
import { useEffect, useState, useRef } from "react";

function SearchPlace() {
  const [places, setPlace] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bound, setBound] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState("");
  const [type, setType] = useState("restaurants");
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const previousBoundsRef = useRef(null);
  const previousTypeRef = useRef(type);

  const threshold = 0.02; // Adjust this value as needed

  const hasSignificantBoundChange = (newBounds, oldBounds) => {
    if (!oldBounds) return true; // First run, no previous bounds to compare

    const latDiff = Math.abs(
      newBounds._northEast.lat - oldBounds._northEast.lat
    );
    const lngDiff = Math.abs(
      newBounds._northEast.lng - oldBounds._northEast.lng
    );

    return latDiff > threshold || lngDiff > threshold;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, long: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        // Optionally set default coordinates
        setCoordinates({ lat: 6, long: 81 });
      }
    );
  }, []);

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredPlaces);
  }, [rating]);

  useEffect(() => {
    if (bound) {
      const fetchPlaces = () => {
        setIsLoading(true);
        getPlaceData(bound._southWest, bound._northEast, type).then((data) => {
          setPlace(
            data?.filter((place) => place.name && place.num_reviews > 0)
          );
          setFilteredPlaces([]);
          setChildClicked(0);
          setIsLoading(false);
          console.log(data);

          // Update previousTypeRef and previousBoundsRef after fetching
          previousTypeRef.current = type;
          previousBoundsRef.current = bound;
        });
      };

      if (hasSignificantBoundChange(bound, previousBoundsRef.current)) {
        fetchPlaces();
      } else if (type !== previousTypeRef.current) {
        fetchPlaces();
      }
    }
  }, [bound, type]);
  return (
    <>
      <CssBaseline />
      <SearchHeader setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBound={setBound}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default SearchPlace;
