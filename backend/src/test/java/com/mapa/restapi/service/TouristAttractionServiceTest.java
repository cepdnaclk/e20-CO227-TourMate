package com.mapa.restapi.service;

import com.mapa.restapi.dto.TouristAttractionDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class TouristAttractionServiceTest {

    @Autowired
    private TouristAttractionService touristAttractionService;

    @Test
    public  void getPlaces(){
        List<TouristAttractionDTO> places = touristAttractionService.getTouristAttraction();
        System.out.println(places);
    }

}