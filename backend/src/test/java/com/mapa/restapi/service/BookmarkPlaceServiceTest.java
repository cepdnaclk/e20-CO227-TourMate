package com.mapa.restapi.service;

import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.UserRepo;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
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
                    System.out.println(bookmarkedPlace.getAttraction_id().getName());

            }
        }
    }

//    @Test
//    void findAttractionPlaceTest(){
//        List<Destination> list = bookmarkPlaceService.findAttractionPlaces(user.getUserid());
//        if (list.isEmpty()) {
//            System.out.println("No places found");
//        }else {
//            for (Destination attraction : list) {
//                System.out.println(attraction.getDestinationName());
//            }
//        }


    @Test
    void addBookmarkTest() {
        TouristAttraction attraction = TouristAttraction.builder()
                .city("Gampola")
                .name("Ambuluwawa")
                .type("Historical")
                .build();
        bookmarkPlaceService.addBookmark(user.getEmail(),attraction);
    }

    @Test
    void removeBookmarkTest(){
        TouristAttraction attraction = TouristAttraction.builder()
                .city("Gampola")
                .name("Ambuluwawa")
                .type("Historical")
                .build();
        System.out.println(bookmarkPlaceService.removeBookmark(attraction));
    }

    @Test
    void getBookmarkTest(){

        System.out.println(bookmarkPlaceService.getBookmarks("test@test.com"));
    }

    @Test
    void getBookmarkPlacesTest(){
        List<TouristAttractionDTO> bookmarkPlaces = bookmarkPlaceService.getBookmarksPlaces("test@test.com");
        for(TouristAttractionDTO bookmark: bookmarkPlaces){
            System.out.println(bookmark.getName());

        }
    }
}