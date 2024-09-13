package com.mapa.restapi.service;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import com.mapa.restapi.repo.UserPlanRepo;
import com.mapa.restapi.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Month;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserPlanServiceTest {

    @Autowired
    private UserPlanService userPlanService;

    @Autowired
    private UserPlanRepo userPlanRepo;

    @Autowired
    private static UserRepo userRepo;

    private static User user;

    @BeforeAll
    static void setUp(@Autowired UserRepo userRepoinstance) {
        userRepo = userRepoinstance;
        user = userRepo.findByEmail("test@test.com").get();
    }

    @Test
    public void addUserPlan_test() {
        UserPlan userPlan = UserPlan.builder()
                .startDate(LocalDate.now())
                .endDate(LocalDate.of(2024, Month.APRIL,22))
                .startLocation("Colombo")
                .endLocation("Kandy")
                .build();

        userPlanService.addPlan(userPlan,user.getEmail());

        UserPlan foundPlan = userPlanRepo.findByUser(user).get();
        assertNotNull(foundPlan);
    }

    @Test
    public void delete_userplan_test(){
        UserPlan plan = UserPlan.builder()
                .user(user)
                .startDate(LocalDate.now())
                .startTime(LocalTime.now())
                .build();

        //userPlanRepo.save(plan);

        userPlanRepo.delete(plan);

    }

}