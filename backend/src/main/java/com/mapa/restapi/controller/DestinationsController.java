package com.mapa.restapi.controller;

import com.mapa.restapi.dto.DestinationDTO;
import com.mapa.restapi.model.Destination;
import com.mapa.restapi.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin // Allows requests from other origins (like your HTML/JS frontend)
public class DestinationsController {

    @Autowired
    private DestinationService destinationService;

    // Endpoint to get destination suggestions based on user input
    @GetMapping("/suggestions")
    public List<Destination> getSuggestions(@RequestParam("query") String query) {
        return destinationService.getSuggestions(query);
    }

    // Endpoint to get destination coordinates by name
    @GetMapping("/coordinates")
    public Destination getDestinationCoordinates(@RequestParam("name") String name) {
        return destinationService.getDestinationByName(name);
    }

    @GetMapping
    public ResponseEntity<List<DestinationDTO>> getAllDestinations(){
        List<DestinationDTO> places = destinationService.getAllDestinations();
        //System.out.println("Get TouristAttractions");
        return ResponseEntity.ok(places);
    }

    //Getting destinations types
    @GetMapping("/getTypes")
    public ResponseEntity<List<String>> getDestinationTypes() {

        List<String> typesSet = destinationService.getDestinationsTypes();

        return ResponseEntity.ok(typesSet); // Return the set wrapped in ResponseEntity
    }


}
