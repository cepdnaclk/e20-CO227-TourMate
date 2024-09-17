package com.mapa.restapi.controller;

import com.mapa.restapi.dto.HotelDto;
import com.mapa.restapi.dto.DestinationDTO;
import com.mapa.restapi.service.HotelRestaurantService;
import com.mapa.restapi.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="*",allowedHeaders = "*")
public class EntityController {

    @Autowired
    private DestinationService destinationService;

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

}
