package com.mapa.restapi.service;

import com.mapa.restapi.dto.HotelDto;
import com.mapa.restapi.model.Hotel;
import com.mapa.restapi.repo.HotelRepo;
import com.mapa.restapi.repo.RestaurantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HotelRestaurantService {

    @Autowired
    private HotelRepo hotelRepo;

    @Autowired
    private RestaurantRepo restaurantRepo;

    @Autowired
    private RouteService routeService;

    public List<HotelDto> getAllHotels() {
        List<Hotel> hotels = hotelRepo.findAll();
        return hotels.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<HotelDto> getHotelsByName(String name) {
        List<Hotel > hotels = hotelRepo.findHotelByName(name).orElse(null);
        assert hotels != null;
        return hotels.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<HotelDto> getHotelsByCity(String city) {

        List<Hotel > hotels =  hotelRepo.findHotelByCity(city).orElse(null);
        assert hotels != null;
        return hotels.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private HotelDto convertToDTO(Hotel hotel) {
        HotelDto dto = HotelDto.builder()
                .name(hotel.getName())
                .city(hotel.getCity())
                .address(hotel.getAddress())
                .coordinates(hotel.getCoordinates())
                .build();
        return dto;
    }
}
