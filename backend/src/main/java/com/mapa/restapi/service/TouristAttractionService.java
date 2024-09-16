package com.mapa.restapi.service;

import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.model.Destination;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.repo.TouristAttractionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TouristAttractionService {

    @Autowired
    private TouristAttractionRepo touristAttractionRepo;

    public List<TouristAttractionDTO> getTouristAttraction() {
        return touristAttractionRepo.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<String> getAttractionsTypes() {
        List<TouristAttraction> destinations =touristAttractionRepo .findAll();
        Set<String> typesSet = new HashSet<>();

        for (TouristAttraction destination : destinations) {
            String[] types = destination.getType().split(",");
            for (String type : types) {
                typesSet.add(type.trim()); // Trim to remove extra spaces
            }
        }

        return new ArrayList<>(typesSet); // Convert Set back to List
    }


    public TouristAttractionDTO convertToDTO(TouristAttraction touristAttraction) {
        TouristAttractionDTO dto = TouristAttractionDTO.builder()
                .id(touristAttraction.getAttractionID())
                .type(touristAttraction.getType())
                .city(touristAttraction.getCity())
                .name(touristAttraction.getName())
                .latitude(touristAttraction.getLatitude())
                .longitude(touristAttraction.getLongitude())
                .phone(touristAttraction.getPhone())
                .description(touristAttraction.getDescription())
                .imgUrl(touristAttraction.getImgUrl())
                .web_url(touristAttraction.getWeb_url())
                .address(touristAttraction.getAddress())
                .rating(touristAttraction.getRating())
                .build();
        return dto;
    }
}
