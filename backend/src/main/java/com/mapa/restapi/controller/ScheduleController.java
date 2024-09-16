package com.mapa.restapi.controller;

import com.mapa.restapi.service.SchedulePlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins="*")
public class ScheduleController {

    @Autowired
    private SchedulePlan schedulePlan;

    @PostMapping("/scheduleCreate")
    public ResponseEntity<String> createSchedule(@AuthenticationPrincipal UserDetails userDetails) throws Exception {
        // Access user details from the authenticated user
        String username = userDetails.getUsername();
        String response = schedulePlan.generateSchedule(username);


        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
