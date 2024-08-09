package com.mapa.restapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
// Class to represent a scheduled event
public class ScheduleEventDto {
    private String place;
    private LocalTime startTime;
    private LocalTime endTime;
    private int travelTime;
    private LocalDate date;
}

