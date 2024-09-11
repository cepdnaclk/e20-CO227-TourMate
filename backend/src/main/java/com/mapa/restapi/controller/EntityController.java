package com.mapa.restapi.controller;

import com.mapa.restapi.dto.HotelDto;
import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.service.HotelRestaurantService;
import com.mapa.restapi.service.TouristAttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="*",allowedHeaders = "*")
public class EntityController {

    @Autowired
    private TouristAttractionService touristAttractionService;

    @Autowired
    private HotelRestaurantService hotelRestaurantService;

    @PostMapping("/getTouristAttractions")
    public ResponseEntity<List<TouristAttractionDTO>> getTouristAttractions(){
        List<TouristAttractionDTO> places = touristAttractionService.getTouristAttraction();
        //System.out.println("Get TouristAttractions");
        return ResponseEntity.ok(places);
    }

    @PostMapping("/getHotels")
    public ResponseEntity<List<HotelDto>> getHotels(){
        List<HotelDto> hotels = hotelRestaurantService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    @PostMapping("/getHotels/{name}")
    public ResponseEntity<List<HotelDto>> getHotelsByName(@PathVariable String name){
        List<HotelDto> hotels = hotelRestaurantService.getHotelsByName(name);
        return ResponseEntity.ok(hotels);
    }
    @PostMapping("/getHotels/{city}")
    public ResponseEntity<List<HotelDto>> getHotelsByCity(@PathVariable String city){
        List<HotelDto> hotels = hotelRestaurantService.getHotelsByCity(city);
        return ResponseEntity.ok(hotels);
    }

}
