package com.mapa.restapi.repo;

import com.mapa.restapi.exception.EntityServiceException;
import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.EntityType;
import com.mapa.restapi.model.User;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class BookmarkedPlaceRepoTest {

    @Autowired
    private BookmarkedPlaceRepo bookmarkedPlaceRepo;

    @Autowired
    private static UserRepo userRepo;

    @Autowired
    private  EntityTypeRepo entityTypeRepo;

    private static User testUser;

    @BeforeAll
    static void setUp(@Autowired UserRepo userRepoInstance) {
        userRepo = userRepoInstance;
        testUser = userRepo.findByEmail("test@test.com").orElse(null);

    }

    @AfterAll
    static void tearDown() {
    }


    @Test
    public void findBookmarkedPlace_by_userID() throws EntityServiceException {
        List<BookmarkedPlace> places = bookmarkedPlaceRepo.findByUserID(testUser.getUserid()).orElse(null);

        for (BookmarkedPlace place : places) {
            System.out.println(place.getAttraction_id().getName());
        }

        assertNotNull(places);
    }

    @Test
    public void findBookmarkedPlace_by_user() throws EntityServiceException {
        List<BookmarkedPlace> places = bookmarkedPlaceRepo.findByUser(testUser).orElse(null);

        for (BookmarkedPlace place : places) {
            System.out.println(place.getAttraction_id().getName());
        }

        assertNotNull(places);
    }
}