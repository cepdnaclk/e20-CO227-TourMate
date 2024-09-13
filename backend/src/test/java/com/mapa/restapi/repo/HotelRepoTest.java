package com.mapa.restapi.repo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class HotelRepoTest {

    @Autowired
    private HotelRepo hotelRepo;
    @Test
    void findHotelByName_test() {


    }

    @Test
    void findHotelByCity_test() {
    }
}