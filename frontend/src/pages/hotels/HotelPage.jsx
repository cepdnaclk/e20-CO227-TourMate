import React, { useEffect, useState } from "react";
import Card from "../../components/PlaceCard/Card";
import "./hotel.css";

export default function HotelPage() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
          setHotels(data);
          setFilteredHotels(data);
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

  useEffect(() => {
    const filtered = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(filtered);
  }, [searchTerm, hotels]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="header">Hotels</h1>
      <div className="search">
        <input
          type="text"
          className="text"
          placeholder="Search by city or hotel name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="card-container">
        {filteredHotels.map((hotel, index) => (
          <Card
            key={index}
            image={hotel.imageUrl}
            name={hotel.name}
            city={hotel.city}
            address={hotel.address}
            coordinates={hotel.coordinates}
            cardType="hotel"
          />
        ))}
      </div>
    </div>
  );
}
