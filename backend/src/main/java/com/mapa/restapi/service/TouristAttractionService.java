package com.mapa.restapi.service;

import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.repo.TouristAttractionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TouristAttractionService {

    @Autowired
    private TouristAttractionRepo touristAttractionRepo;

    public List<TouristAttractionDTO> getTouristAttraction() {
        return touristAttractionRepo.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private TouristAttractionDTO convertToDTO(TouristAttraction touristAttraction) {
        TouristAttractionDTO dto = TouristAttractionDTO.builder()
                .id(touristAttraction.getAttractionID())
                .type(touristAttraction.getType())
                .city(touristAttraction.getCity())
                .name(touristAttraction.getName())
                .title(touristAttraction.getTitle())
                .coordinates(touristAttraction.getCoordinates())
                .description(touristAttraction.getDescription())
                .build();
        return dto;
    }
}
