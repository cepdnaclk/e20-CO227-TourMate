/*
  List component which render Place in SearchPlace page
*/

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect, createRef } from "react";
import "./List.css";
import Place from "../Place/Place";

export default function List({
  places,
  childClicked,
  isLoading,
  rating,
  setRating,
  type,
  setType,
}) {
  const [elRefs, setElRefs] = useState([]);

  useEffect(() => {
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places]);

  return (
    <div
      className="container"
      style={{ position: "relative", height: "100%", overflowY: "auto" }}
    >
      <Typography variant="h6">Restaurant, Hotels & Attractions</Typography>
      {isLoading ? (
        <div className="loading">
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          <FormControl className="formControl">
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              className="select"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="hotels">Hotels</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>
          <FormControl className="formControl">
            <InputLabel>Rating</InputLabel>
            <Select
              value={rating}
              className="select"
              onChange={(e) => setRating(e.target.value)}
            >
              <MenuItem value={0}>All</MenuItem>
              <MenuItem value={3}>Above 3.0</MenuItem>
              <MenuItem value={4}>Above 4.0</MenuItem>
            </Select>
          </FormControl>
          <Grid
            container
            spacing={3}
            className="list"
            style={{ height: "80vh", overflowY: "auto" }}
          >
            {places?.map((place, i) => (
              <Grid item key={i} xs={12} ref={elRefs[i]}>
                <Place
                  place={place}
                  selected={childClicked === i}
                  refProp={elRefs[i]}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}
