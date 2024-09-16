package com.mapa.restapi.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TouristAttractionServiceTest {

    @Autowired
    private TouristAttractionService touristAttractionService;
    @Test
    void getTouristAttraction() {
    }

    @Test
    void getAttractionsTypes() {
        List<String> types = touristAttractionService.getAttractionsTypes();
        System.out.println(types);
    }
}