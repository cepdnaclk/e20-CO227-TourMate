//package com.mapa.restapi.service;
//
//import ch.qos.logback.core.testUtil.TeeOutputStream;
//import com.mapa.restapi.exception.SchedulePlanException;
//import com.mapa.restapi.model.TouristAttraction;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest
//class SchedulePlanTest {
//
//    @Autowired
//    SchedulePlan schedulePlan ;
//
//    @Test
//    void getUserPlan() {
//    }
//
//    @Test
//    void getUserBookmarkPlace() {
//    }
//
//    @Test
//    void generateSchedule() throws Exception {
//        schedulePlan.generateSchedule("test@test.com");
//    }
//
//    @Test
//    void calculateTravelTimeTest() {
//        System.out.println(schedulePlan.calculateTravelTime("Nawalapitiya","Peradeniya"));
//    }
//
//    @Test
//    void sortPlacesByTravelTimeTest(){
//        Map<String, Integer> cityTravelTimes = new HashMap<>();
//        cityTravelTimes.put("Galle", 120);
//        cityTravelTimes.put("Colombo", 0);
//        cityTravelTimes.put("Unawatuna", 220);
//        cityTravelTimes.put("Hikkaduwa", 100);
//
//
//        List<TouristAttraction> filteredPlaces = new ArrayList<>();
//        filteredPlaces.add( TouristAttraction.builder().city("Colombo").build());
//        filteredPlaces.add( TouristAttraction.builder().city("Unawatuna").build());
//        filteredPlaces.add( TouristAttraction.builder().city("Hikkaduwa").build());
//        filteredPlaces.add( TouristAttraction.builder().city("Galle").build());
//
//        List<TouristAttraction> attraction = schedulePlan.sortPlacesByTravelTime(cityTravelTimes,filteredPlaces);
//
//        for (TouristAttraction obj :attraction){
//            System.out.println(obj.getCity());
//        }
//    }
//}