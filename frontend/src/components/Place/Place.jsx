import React from "react";
import { LocationOn, Phone } from "@mui/icons-material";
import "./Place.css";
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
} from "@mui/material";

export default function Place({ place, selected, refProp }) {
  if (selected) {
    refProp?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    selected = false;
  }

  return (
    <Card elevation={6}>
      <CardMedia
        style={{ height: 350 }}
        image={
          place.photo
            ? place.photo.images.large.url
            : "https://st4.depositphotos.com/14953852/24787/v/1600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
        }
        title={place.name}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {place.name}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Rating value={place.rating} readOnly />
          <Typography gutterBottom variant="subtitle">
            out of {place.num_reviews} reviews
          </Typography>
        </Box>
        {place?.price && (
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1">Price</Typography>
            <Typography gutterBottom variant="subtitle">
              {place.price}
            </Typography>
          </Box>
        )}
        <Box display="flex" justifyContent="space-between">
          <Typography variant="subtitle" marginRight="30px">
            Ranking
          </Typography>
          <Typography gutterBottom variant="subtitle">
            {place.ranking}
          </Typography>
        </Box>
        {place?.cuisine?.map(({ name }) => (
          <Chip key={name} size="small" label={name} className="chip"></Chip>
        ))}
        {place?.address && (
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
        {place?.phone && (
          <Typography
            gutterBottom
            variant="subtitle2"
            color="textSecondary"
            className="spacing"
          >
            <Phone />
            <a href={`tel:${place.phone}`} className="phoneLink">
              {place.phone}
            </a>
          </Typography>
        )}
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => window.open(place.web_url, "_blank")}
          >
            Trip Advisor
          </Button>
          {place?.website && (
            <Button
              size="small"
              color="primary"
              onClick={() => window.open(place.website, "_blank")}
            >
              Website
            </Button>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
}
