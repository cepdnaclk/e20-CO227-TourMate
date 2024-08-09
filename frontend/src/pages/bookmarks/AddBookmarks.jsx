import React, { useEffect, useState } from "react";
import Card from "../../components/PlaceCard/Card";
import "./AddBookmarks.css";

export default function AddBookmarks() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch(
          "http://localhost:1200/getTouristAttractions",
          {
            method: "POST",
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="header">Tourist Attractions</h1>
      <div className="card-container">
        {attractions.map((attraction, index) => (
          <Card
            key={index}
            image={attraction.imageUrl}
            name={attraction.name}
            type={attraction.type}
            description={attraction.description}
            city={attraction.city}
            id={attraction.id}
          />
        ))}
      </div>
    </div>
  );
}