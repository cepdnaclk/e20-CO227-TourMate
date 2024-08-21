import React, { useEffect, useState } from "react";
import Card from "../../components/PlaceCard/Card";

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:1200/getHotels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setHotels(data);
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

    fetchHotels();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="header">Hotels</h1>
      <div className="card-container">
        {hotels.map((hotels, index) => (
          <Card
            key={index}
            image={hotels.imageUrl}
            name={hotels.name}
            city={hotels.city}
            address={hotels.address}
            coordinates={hotels.coordinates}
            cardType="hotel"
          />
        ))}
      </div>
    </div>
  );
}
