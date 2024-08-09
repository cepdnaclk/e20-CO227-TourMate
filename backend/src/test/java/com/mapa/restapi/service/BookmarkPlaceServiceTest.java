package com.mapa.restapi.service;

import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.UserRepo;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BookmarkPlaceServiceTest {

    @Autowired
    private static UserRepo userRepo;

    @Autowired
    private BookmarkPlaceService bookmarkPlaceService;

    private static User user;

    @BeforeAll
    static void setUp(@Autowired UserRepo userRepoinstance) {
        userRepo = userRepoinstance;
        user = userRepo.findByEmail("test@test.com").get();
    }

    @AfterAll
    static void tearDown() {
    }

    @Test
    void findBookmarkTest() {

        List<BookmarkedPlace> list = bookmarkPlaceService.findBookMarks(user.getUserid());
        if (list.isEmpty()) {
            System.out.println("No places found");
        } else {
            // Iterate and print details
            for (BookmarkedPlace bookmarkedPlace : list) {
                    System.out.println(bookmarkedPlace.getEntityID().getEntityType());
                
            }
        }
    }

    @Test
    void findAttractionPlaceTest(){
        List<TouristAttraction> list = bookmarkPlaceService.findAttractionPlaces(user.getUserid());
        if (list.isEmpty()) {
            System.out.println("No places found");
        }else {
            for (TouristAttraction attraction : list) {
                System.out.println(attraction.getName());
            }
        }
    }
}