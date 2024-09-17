package com.mapa.restapi.service;

import com.mapa.restapi.model.Destination;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootTest
class SchedulePlanTest {

    @Autowired
    SchedulePlan schedulePlan ;

    @Test
    void getUserPlan() {
    }

    @Test
    void getUserBookmarkPlace() {
    }

    @Test
    void generateSchedule() throws Exception {
        schedulePlan.generateSchedule("test@test.com");
    }

    @Test
    void calculateTravelTimeTest() {
        System.out.println(schedulePlan.calculateTravelTime("Nawalapitiya","Peradeniya"));
    }

    @Test
    void sortPlacesByTravelTimeTest(){
        Map<String, Integer> cityTravelTimes = new HashMap<>();
        cityTravelTimes.put("Galle", 120);
        cityTravelTimes.put("Colombo", 0);
        cityTravelTimes.put("Unawatuna", 220);
        cityTravelTimes.put("Hikkaduwa", 100);


        List<Destination> filteredPlaces = new ArrayList<>();
        filteredPlaces.add( Destination.builder().city("Colombo").build());
        filteredPlaces.add( Destination.builder().city("Unawatuna").build());
        filteredPlaces.add( Destination.builder().city("Hikkaduwa").build());
        filteredPlaces.add( Destination.builder().city("Galle").build());

        List<Destination> attraction = schedulePlan.sortPlacesByTravelTime(cityTravelTimes,filteredPlaces);

        for (Destination obj :attraction){
            System.out.println(obj.getCity());
        }
    }
}