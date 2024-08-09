package com.mapa.restapi.controller;

import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.service.TouristAttractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins="*",allowedHeaders = "*")
public class EntityController {


    @Autowired
    private TouristAttractionService touristAttractionService;

    @PostMapping("/getTouristAttractions")
    public ResponseEntity<List<TouristAttractionDTO>> getTouristAttractions(){
        List<TouristAttractionDTO> places = touristAttractionService.getTouristAttraction();
        //System.out.println("Get TouristAttractions");
        return ResponseEntity.ok(places);
    }
}
