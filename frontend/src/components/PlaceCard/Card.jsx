import React from "react";
import "./Card.css";

export default function Card(props) {
  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:1200/addBookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          attractionID: props.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bookmark added:", data);
        window.alert("Bookmarke added");
        // Optionally, show a success message or update the UI
      } else {
        console.error("Error adding bookmark:", response.statusText);
        window.alert("Error adding bookmark");
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Error in fetching data:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="place-card" onClick={handleClick}>
      <div className="image">
        <image className="image" src={props.image} alt={props.name}></image>
      </div>
      <div className="info">
        <h1 className="name">{props.name}</h1>
        <h2 className="type">{props.type}</h2>
        <h2 className="discrition">{props.description}</h2>
        <h2 className="city">{props.city}</h2>
        <h1 className="id">{props.id}</h1>
      </div>
    </div>
  );
}
