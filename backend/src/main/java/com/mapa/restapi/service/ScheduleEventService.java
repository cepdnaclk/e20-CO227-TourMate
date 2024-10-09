package com.mapa.restapi.service;

import com.mapa.restapi.dto.ScheduleEventDto;
import com.mapa.restapi.model.ScheduleEvent;
import com.mapa.restapi.model.Stop;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.ScheduleEventRepo;
import com.mapa.restapi.repo.StopRepo;
import com.mapa.restapi.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleEventService {

    @Autowired
    private ScheduleEventRepo scheduleEventRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private StopRepo stopRepo;

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

        // Save the schedule event and associated stops to the repository
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

    public ScheduleEventDto convertDto(ScheduleEvent scheduleEvent){
        return ScheduleEventDto.builder()
                .scheduleId(scheduleEvent.getScheduleId())
                .endLocation(scheduleEvent.getEndLocation())
                .startLocation(scheduleEvent.getStartLocation())
                .stops(scheduleEvent.getStops())
                .endTime(scheduleEvent.getEndTime())
                .startTime(scheduleEvent.getStartTime())
                .build();
    }
}
