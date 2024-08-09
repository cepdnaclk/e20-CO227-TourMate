package com.mapa.restapi.repo;

import com.mapa.restapi.dto.ScheduleEventDto;
import com.mapa.restapi.model.ScheduleEvent;
import com.mapa.restapi.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ScheduleEventRepoTest {

    @Autowired
    private ScheduleEventRepo scheduleEventRepo;

    @Autowired
    private UserRepo userRepo;

    @Test
    void findScheduleEventByUserID() {
        User user = userRepo.findByEmail("test@test.com").orElseThrow();
        System.out.println(user);
        List<ScheduleEvent> events = scheduleEventRepo.findScheduleEventByUserID(user.getUserid());
        System.out.println(events.isEmpty());
        for (ScheduleEvent event: events ){
            System.out.println(event);
        }
    }
}