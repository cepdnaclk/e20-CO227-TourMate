import React from "react";
import "./Card.css";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { LocationOn, Phone } from "@mui/icons-material";

export default function AttractionCard({ place }) {
  const isDesktop = useMediaQuery("(min-width:600px)");
  const handleClick = async () => {
    try {
      const response = await fetch("http://localhost:1200/addBookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          attractionID: place.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bookmark added:", data);
        window.alert("Bookmark added");
      } else {
        console.error("Error adding bookmark:", response.statusText);
        window.alert("Error adding bookmark");
      }
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  return (
    <Card elevation={6} className="card" sx={{ width: 300 }}>
      <CardMedia
        style={{ height: 350 }}
        image={
          place.imgUrl
            ? place.imgUrl
            : "https://st4.depositphotos.com/14953852/24787/v/1600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
        }
        title={place.name}
        className="card-media"
        onClick={handleClick}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {place.name}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Rating value={Number(place.rating)} precision={0.5} readOnly />
        </Box>
        {place.type.split(",").map((name) => (
          <Chip
            key={name.trim()}
            size="small"
            label={name.trim()}
            className="chip"
          />
        ))}
        {place.address && (
          <Typography
            gutterBottom
            variant="subtitle2"
            color="textSecondary"
            className="subtitle"
          >
            <LocationOn />
            {place.address}
          </Typography>
        )}
        {place.phone && (
          <Typography
            gutterBottom
            variant="subtitle2"
            color="textSecondary"
            className="spacing"
          >
            <Phone />
            {isDesktop ? (
              <span className="phoneLink">{place.phone}</span>
            ) : (
              <a href={`tel:${place.phone}`} className="phoneLink">
                {place.phone}
              </a>
            )}
          </Typography>
        )}
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            size="small"
            color="primary"
            onClick={() => window.open(place.web_url, "_blank")}
          >
            Trip Advisor
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}
