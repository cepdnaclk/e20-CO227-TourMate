package com.mapa.restapi.controller;

import com.mapa.restapi.dto.HotelDto;
import com.mapa.restapi.service.DestinationService;
import com.mapa.restapi.service.HotelRestaurantService;
import com.mapa.restapi.service.TouristAttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins="*",allowedHeaders = "*")
public class EntityController {

    @Autowired
    private TouristAttractionService touristAttractionService;
    @Autowired
    private HotelRestaurantService hotelRestaurantService;


    @GetMapping("/getHotels")
    public ResponseEntity<List<HotelDto>> getHotels(){
        List<HotelDto> hotels = hotelRestaurantService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/getHotels/{name}")
    public ResponseEntity<List<HotelDto>> getHotelsByName(@PathVariable String name){
        List<HotelDto> hotels = hotelRestaurantService.getHotelsByName(name);
        return ResponseEntity.ok(hotels);
    }
    @GetMapping("/getHotels/{city}")
    public ResponseEntity<List<HotelDto>> getHotelsByCity(@PathVariable String city){
        List<HotelDto> hotels = hotelRestaurantService.getHotelsByCity(city);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/attractions/getTypes")
    public ResponseEntity<List<String>> getDestinationTypes() {

        List<String> typesSet =touristAttractionService.getAttractionsTypes ();

        return ResponseEntity.ok(typesSet); // Return the set wrapped in ResponseEntity
    }

}
