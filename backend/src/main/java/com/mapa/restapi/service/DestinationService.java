package com.mapa.restapi.service;

import com.mapa.restapi.dto.DestinationDTO;
import com.mapa.restapi.model.Destination;
import com.mapa.restapi.repo.DestinationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepo destinationRepository;

    // Fetch destination suggestions based on user input
    public List<Destination> getSuggestions(String query) {
        return destinationRepository.findByNameContaining(query);
    }

    // Fetch destination coordinates by name
    public Destination getDestinationByName(String destinationName) {
        List<Destination> destinations = destinationRepository.findByNameContaining(destinationName);
        if (!destinations.isEmpty()) {
            return destinations.get(0); // Return the first matching result
        }
        return null;
    }

    public List<DestinationDTO> getAllDestinations() {
        return destinationRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<String> getDestinationsTypes() {
        List<Destination> destinations = destinationRepository.findAll();
        Set<String> typesSet = new HashSet<>();

        for (Destination destination : destinations) {
            String[] types = destination.getType().split(","); // Assuming `getTypes()` returns the comma-separated string
            for (String type : types) {
                typesSet.add(type.trim()); // Trim to remove extra spaces
            }
        }

        return new ArrayList<>(typesSet); // Convert Set back to List
    }

    private DestinationDTO convertToDTO(Destination destination) {
        DestinationDTO dto = DestinationDTO.builder()
                .id(destination.getAttractionID())
                .type(destination.getType())
                .city(destination.getCity())
                .name(destination.getName())
                .latitude(destination.getLatitude())
                .longitude(destination.getLongitude())
                .phone(destination.getPhone())
                .description(destination.getDescription())
                .imgUrl(destination.getImgUrl())
                .web_url(destination.getWeb_url())
                .address(destination.getAddress())
                .rating(destination.getRating())
                .district(destination.getDistrict())
                .build();
        return dto;
    }
}
