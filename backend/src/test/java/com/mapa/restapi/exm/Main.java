package com.mapa.restapi.exm;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        try {
            // Get the start and end locations
            String startLocation = "79.8612,6.9271"; // Colombo
            String endLocation = "80.2170,6.0324"; // Galle

            // Calculate the initial route
            String route = RouteCalculator.getRoute(startLocation, endLocation);
            System.out.println("Route: " + route);

            // Parse the route to get coordinates, distance, and duration
            JSONObject jsonRoute = new JSONObject(route);
            JSONArray coordinates = jsonRoute.getJSONArray("routes")
                    .getJSONObject(0)
                    .getJSONObject("geometry")
                    .getJSONArray("coordinates");

            // Get distance and duration directly as values
            JSONObject routeInfo = jsonRoute.getJSONArray("routes").getJSONObject(0);
            double distance = routeInfo.getDouble("distance"); // distance in meters
            double duration = routeInfo.getDouble("duration"); // duration in seconds

            // Convert distance to kilometers and duration to hours and minutes
            double distanceKm = distance / 1000;
            int hours = (int) (duration / 3600);
            int minutes = (int) ((duration % 3600) / 60);

            // Print start and end points
            System.out.println("Starting Point: Colombo");
            System.out.println("Ending Point: Galle");

            // Print total distance and time
            System.out.println("Total Distance: " + distanceKm + " km");
            System.out.println("Total Time: " + hours + " hours and " + minutes + " minutes");

            // Assuming you need to iterate over the coordinates to find nearby attractions
            double routeLatitude = coordinates.getJSONArray(0).getDouble(1);
            double routeLongitude = coordinates.getJSONArray(0).getDouble(0);

            // Connect to the database
            Connection conn = DatabaseConnection.getConnection();

            System.out.println("------------------------------");
            ResultSet resultSet = NearbyAttractionsFinder.getNearbyAttractions(conn,routeLatitude,routeLongitude,1000);
            NearbyAttractionsFinder.printNearbyAttractions(resultSet);
            System.out.println("------------------------------");

            // Updated SQL query to select the 'coordinates' column
            String sql = "SELECT name, coordinates FROM tourist_attraction";
            ResultSet attractions = conn.createStatement().executeQuery(sql);

            // Debugging: Print column names
            ResultSetMetaData rsmd = attractions.getMetaData();
            int columnCount = rsmd.getColumnCount();
            System.out.println("Columns in ResultSet:");
            for (int i = 1; i <= columnCount; i++) {
                System.out.println(rsmd.getColumnName(i));
            }

            // List to store all coordinates for the final route
            List<double[]> allCoordinates = new ArrayList<>();
            for (int i = 0; i < coordinates.length(); i++) {
                JSONArray coord = coordinates.getJSONArray(i);
                allCoordinates.add(new double[]{coord.getDouble(1), coord.getDouble(0)});
            }

            // Update total distance and duration
            double totalDistance = distance;
            double totalDuration = duration;

            // Iterate through each attraction and calculate the route
            while (attractions.next()) {
                String attractionName = attractions.getString("name");
                String[] coords = attractions.getString("coordinates").split(",");
                double attractionLat = Double.parseDouble(coords[0].trim());
                double attractionLon = Double.parseDouble(coords[1].trim());

                // Debugging: Print the coordinates being passed
                System.out.printf("Calculating route to attraction: %s (%f, %f)\n", attractionName, attractionLat, attractionLon);

                // Get the route to the attraction
                String attractionRoute = RouteCalculator.getRoute(routeLatitude + "," + routeLongitude, attractionLat + "," + attractionLon);
                //System.out.println("Attraction Route: " + attractionRoute); // Debugging: Print the route response
                JSONObject attractionJsonRoute = new JSONObject(attractionRoute);
                JSONArray attractionCoordinates = attractionJsonRoute.getJSONArray("routes")
                        .getJSONObject(0)
                        .getJSONObject("geometry")
                        .getJSONArray("coordinates");
                double attractionDistance = attractionJsonRoute.getJSONArray("routes").getJSONObject(0).getDouble("distance");
                double attractionDuration = attractionJsonRoute.getJSONArray("routes").getJSONObject(0).getDouble("duration");

                // Debugging: Print the calculated distance and duration
                System.out.printf("Distance to %s: %f meters, Duration: %f seconds\n", attractionName, attractionDistance, attractionDuration);

                // Add attraction route coordinates to the list
                for (int i = 0; i < attractionCoordinates.length(); i++) {
                    JSONArray coord = attractionCoordinates.getJSONArray(i);
                    allCoordinates.add(new double[]{coord.getDouble(1), coord.getDouble(0)});
                }

                // Update total distance and duration
                totalDistance += attractionDistance;
                totalDuration += attractionDuration;

                // Print the route details to the attraction
//                System.out.printf("Route to Attraction: %s\n", attractionName);
//                System.out.printf("Distance: %.2f km, Time: %.2f minutes\n", attractionDistance / 1000, attractionDuration / 60);

                // Update the current location
                routeLatitude = attractionLat;
                routeLongitude = attractionLon;
            }

            // Print updated total distance and duration
            double totalDistanceKm = totalDistance / 1000;
            int totalHours = (int) (totalDuration / 3600);
            int totalMinutes = (int) ((totalDuration % 3600) / 60);
            System.out.println("Updated Total Distance: " + totalDistanceKm + " km");
            System.out.println("Updated Total Time: " + totalHours + " hours and " + totalMinutes + " minutes");

            conn.close();

            // Save coordinates to a file for visualization
            saveCoordinatesToFile(allCoordinates);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void saveCoordinatesToFile(List<double[]> coordinates) {
        try (PrintWriter writer = new PrintWriter(new File("coordinates.js"))) {
            writer.println("var coordinates = [");
            for (double[] coord : coordinates) {
                writer.printf("    [%.6f, %.6f],\n", coord[0], coord[1]);
            }
            writer.println("];");
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
}
