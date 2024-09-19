import React, { useEffect, useState } from "react";
import Card from "../../components/PlaceCard/Card";
import "./AddBookmarks.css";
import { Box, FormControlLabel, FormGroup, Checkbox } from "@mui/material";
import Navbar2 from "../../components/Navbar/Navbar2";
import Footer from "../../components/Footer/Footer";

export default function AddBookmarks() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Function to handle checkbox selection
  const handleTypeChange = (event) => {
    const value = event.target.name;
    if (event.target.checked) {
      setSelectedTypes([...selectedTypes, value]);
    } else {
      setSelectedTypes(selectedTypes.filter((type) => type !== value));
    }
  };

  // Function to filter attractions based on selected types
  useEffect(() => {
    const filtered = attractions.filter((attraction) => {
      const attractionTypes = attraction.type.split(", ");
      return selectedTypes.some((selectedType) =>
        attractionTypes.includes(selectedType)
      );
    });

    setFilteredPlaces(filtered); // Update filteredAttractions state
  }, [selectedTypes, attractions]); // Make sure to include attractions as a dependency

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:1200/attractions/getTypes",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          console.log("Error fetching destination types:", response.status);
          return;
        }
        console.log(response);
        const data = await response.json();
        setTypes(data); // Set the response data (a list of strings) to state
      } catch (error) {
        console.error("Error fetching destination types:", error);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch(
          "http://localhost:1200/attractions/getall",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAttractions(data);
        } else {
          console.error("Error:", response.statusText);
          setError("Failed to fetch data");
        }
      } catch (error) {
        console.log("Error in fetching data:", error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch("http://localhost:1200/getbookmarks", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Bookmarks:", data);
          setBookmarks(data);
        } else {
          console.log("Error getting bookmarks:", response.status);
        }
      } catch (error) {
        console.log("Error fetching bookmarks");
      }
    };

    fetchBookmarks();
  }, []);

  //filtering
  useEffect(() => {
    const filteredPlace = attractions.filter((place) => {
      // const typeMatches = place.type
      //   .split(",")
      //   .map((type) => type.trim().toLowerCase()) // Split and trim each type
      //   .some((type) => type.includes(searchTerm.toLowerCase())); // Check if any type matches the searchTerm

      // Filter based on name, city, or type
      return (
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.city.toLowerCase().includes(searchTerm.toLowerCase())
        // typeMatches
      );
    });

    setFilteredPlaces(filteredPlace);
  }, [searchTerm, attractions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar2 />
      <div className="container" style={{ marginTop: "100px" }}>
        <h1 className="header-bookmark">Tourist Attractions</h1>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "5px",
          }}
        >
          <input
            type="text"
            placeholder="search by city or names"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {types.map((type, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    name={type}
                    checked={selectedTypes.includes(type)}
                    onChange={handleTypeChange}
                  />
                }
                label={type.charAt(0).toUpperCase() + type.slice(1)} // Capitalize first letter
              />
            ))}
          </FormGroup>
        </Box>

        <Box
          display="flex"
          sx={{
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            padding: 2,
            maxWidth: "100%",
          }}
        >
          {(filteredPlaces.length > 0 ? filteredPlaces : attractions).map(
            (attraction, _) => (
              <Card
                place={attraction}
                bookmarked={bookmarks.includes(attraction.apiLocationId)}
              />
            )
          )}
        </Box>
      </div>
    </>
  );
}
