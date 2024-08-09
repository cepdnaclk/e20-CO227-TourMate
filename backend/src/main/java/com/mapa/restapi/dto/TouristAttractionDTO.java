package com.mapa.restapi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TouristAttractionDTO {

    private long id;
    private String type;
    private String description;
    private String title;
    private String name;
    private String city;
    private String coordinates;

}

