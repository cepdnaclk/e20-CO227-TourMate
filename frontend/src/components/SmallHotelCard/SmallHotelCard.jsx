import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Rating,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const RestaurantDisplay = ({ mealRestaurants }) => {
  // Function to handle opening Google Maps
  const openInGoogleMaps = (name) => {
    const query = encodeURIComponent(name);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <Box>
      {mealRestaurants.map((item, index) => (
        <Box key={index} mb={2}>
          {/* Display meal type */}
          <Typography variant="h6">Meal: {item.meal}</Typography>

          {/* Display restaurant cards */}
          <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
            {item.restaurants.length > 0 ? (
              item.restaurants.slice(0, 5).map((restaurant, idx) => (
                <Card key={idx} sx={{ maxWidth: 200 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      restaurant?.photo?.images?.large?.url ||
                      "default_image_url"
                    }
                    alt={restaurant.name}
                  />
                  <CardContent>
                    {/* Restaurant name */}
                    <Typography variant="h6" component="div">
                      {restaurant.name}
                    </Typography>

                    {/* Restaurant rating */}
                    <Typography variant="body2" color="text.secondary">
                      <Rating
                        value={restaurant.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </Typography>

                    {/* Restaurant city with location icon */}
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" color="text.secondary" mr={1}>
                        {restaurant?.address_obj?.city}
                      </Typography>
                      <IconButton
                        onClick={() => openInGoogleMaps(restaurant.name)}
                        color="primary"
                      >
                        <LocationOnIcon />
                      </IconButton>
                    </Box>

                    {/* Restaurant cuisine */}
                    <Box mt={1}>
                      {restaurant?.cuisine?.slice(0, 3).map(({ name }) => (
                        <Chip
                          key={name}
                          size="small"
                          label={name}
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2">No restaurants available.</Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RestaurantDisplay;
