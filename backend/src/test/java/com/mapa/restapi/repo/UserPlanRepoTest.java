package com.mapa.restapi.repo;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.Month;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
class UserPlanRepoTest {

    @Autowired
    private UserPlanRepo userPlanRepo;


    private static UserRepo userRepo;

    private static User user;

    @BeforeAll
    static void setUp(@Autowired UserRepo userRepoInstance ) {
        userRepo=userRepoInstance;
        user = userRepo.findByEmail("test@test.com").get();
    }

    @AfterAll
    static void tearDown() {
    }

    @Test
    void saveUserPlan() {
        UserPlan userPlan = UserPlan.builder()
                .startDate(LocalDate.now())
                .endDate(LocalDate.of(2024, Month.APRIL,22))
                .startLocation("Colombo")
                .endLocation("Kandy")
                .user(user)
                .build();

        userPlanRepo.save(userPlan);
    }

    @Test
    void getUserPlan() {

        UserPlan userPlan = userPlanRepo.findByUser(user).orElse(null);
        assertNotNull(userPlan);

    }

    @Test
    void findUserPlan_by_userID() {
        UserPlan userPlan = userPlanRepo.findByUserID(user.getUserid()).orElse(null);
        System.out.println(userPlan);
        assertNotNull(userPlan);
    }

    //Deleting user delete user plan relate to that user
    @Test
    void delete_userPlan_test() {
        UserPlan userPlan = userPlanRepo.findByUser(user).orElse(null);
        System.out.println(userPlan);
        assert userPlan != null;
        userPlanRepo.deleteById(userPlan.getPlanID());
        userPlan = userPlanRepo.findByPlanID(userPlan.getPlanID()).orElse(null);
        System.out.println(userPlan);
        assertNull(userPlan);

    }

}