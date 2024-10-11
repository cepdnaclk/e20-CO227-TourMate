package com.mapa.restapi.service;

import com.mapa.restapi.dto.ScheduleEventDto;
import com.mapa.restapi.model.*;
import com.mapa.restapi.repo.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleEventService {

    @Autowired
    private ScheduleEventRepo scheduleEventRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RestaurantRepo restaurantRepo;

    @Autowired
    private HotelRepo hotelRepo;


//    @Transactional
//    public int addScheduleEvent(String email, ScheduleEvent scheduleEvent) {
//        // Find the user by email
//        User user = userRepo.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Associate the user with the schedule event
//        scheduleEvent.setUser(user);
//
//        // Associate the stops with the schedule event
//        if (scheduleEvent.getStops() != null) {
//            for (Stop stop : scheduleEvent.getStops()) {
//                stop.setScheduleEvent(scheduleEvent);
//            }
//        }
//
//        // Check and remove existing schedule restaurants from the schedule event
//        if (scheduleEvent.getScheduleRestaurants() != null) {
//            Iterator<ScheduleRestaurant> iterator = scheduleEvent.getScheduleRestaurants().iterator();
//            while (iterator.hasNext()) {
//                ScheduleRestaurant scheduleRestaurant = iterator.next();
//                Restaurant existingRestaurant = restaurantRepo.findByNameAndLocation(
//                        scheduleRestaurant.getRestaurant().getName(),
//                        scheduleRestaurant.getRestaurant().getLocation()
//                );
//
//                if (existingRestaurant != null) {
//                    // Restaurant exists in the database, remove it from schedule event
//                    iterator.remove();
//                } else {
//                    // New restaurant, save the new record
//                    scheduleRestaurant.setRestaurant(restaurantRepo.save(scheduleRestaurant.getRestaurant()));
//                }
//
//                scheduleRestaurant.setScheduleEvent(scheduleEvent);
//            }
//        }
//
//        // Check and remove existing schedule hotels from the schedule event
//        if (scheduleEvent.getScheduleHotels() != null) {
//            Iterator<ScheduleHotel> iterator = scheduleEvent.getScheduleHotels().iterator();
//            while (iterator.hasNext()) {
//                ScheduleHotel scheduleHotel = iterator.next();
//                Hotel existingHotel = hotelRepo.findByNameAndLocation(
//                        scheduleHotel.getHotel().getName(),
//                        scheduleHotel.getHotel().getLocation()
//                );
//
//                if (existingHotel != null) {
//                    // Hotel exists in the database, remove it from schedule event
//                    iterator.remove();
//                } else {
//                    // New hotel, save the new record
//                    scheduleHotel.setHotel(hotelRepo.save(scheduleHotel.getHotel()));
//                }
//
//                scheduleHotel.setScheduleEvent(scheduleEvent);
//            }
//        }
//
//        // Save the schedule event and associated stops to the repository
//        scheduleEventRepo.save(scheduleEvent);
//
//        return 0; // Success
//    }

    @Transactional
    public int addScheduleEvent(String email, ScheduleEvent scheduleEvent) {
        // Find the user by email
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        // Associate the user with the schedule event
        scheduleEvent.setUser(user);

        // Associate the stops with the schedule event
        if (scheduleEvent.getStops() != null) {
            for (Stop stop : scheduleEvent.getStops()) {
                stop.setScheduleEvent(scheduleEvent);
            }
        }

        // Associate the schedule restaurants with the schedule event
        if (scheduleEvent.getScheduleRestaurants() != null) {
            for (ScheduleRestaurant scheduleRestaurant : scheduleEvent.getScheduleRestaurants()) {
                scheduleRestaurant.setScheduleEvent(scheduleEvent);
            }
        }

        // Associate the schedule hotels with the schedule event
        if (scheduleEvent.getScheduleHotels() != null) {
            for (ScheduleHotel scheduleHotel : scheduleEvent.getScheduleHotels()) {
                scheduleHotel.setScheduleEvent(scheduleEvent);
            }
        }

        // Save the schedule event, hotels, restaurants, and associated stops to the repository
        scheduleEventRepo.save(scheduleEvent);

        return 0; // Success
    }


    public List<ScheduleEventDto> getAllSchedules(String username) {
        User user=userRepo.findByEmail(username).orElseThrow(()->new RuntimeException("No user found"));
        List<ScheduleEvent> scheduleEvents = scheduleEventRepo.findScheduleEventByUserID(user.getUserid());
        if (scheduleEvents.isEmpty()){
            return new ArrayList<>();
        }
        return scheduleEvents.stream().map(this::convertDto).collect(Collectors.toList());
    }

    public ScheduleEvent getScheduleById(Long scheduleId) {
        return scheduleEventRepo.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule not found with id: " + scheduleId));
    }

    public ScheduleEventDto convertDto(ScheduleEvent scheduleEvent){
        return ScheduleEventDto.builder()
                .scheduleId(scheduleEvent.getScheduleId())
                .endLocation(scheduleEvent.getEndLocation())
                .startLocation(scheduleEvent.getStartLocation())
                .stops(scheduleEvent.getStops())
                .hotels(scheduleEvent.getScheduleHotels())
                .restaurants(scheduleEvent.getScheduleRestaurants())
                .endTime(scheduleEvent.getEndTime())
                .startTime(scheduleEvent.getStartTime())
                .build();

    }
}
