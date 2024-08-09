package com.mapa.restapi.service;

import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.EntityType;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.BookmarkedPlaceRepo;
import com.mapa.restapi.repo.EntityTypeRepo;
import com.mapa.restapi.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookmarkPlaceService {

    @Autowired
    private BookmarkedPlaceRepo bookmarkedPlaceRepo;

    @Autowired
    private EntityTypeRepo entityTypeRepo;
    @Autowired
    private UserRepo userRepo;


    public List<BookmarkedPlace> findBookMarks(long userID) {
        return bookmarkedPlaceRepo.findByUserID(userID).orElse(null);
    }

    public List<TouristAttraction> findAttractionPlaces(long userID) {
        List<TouristAttraction> touristAttractions = new ArrayList<>();
        List<BookmarkedPlace> list = findBookMarks(userID);
        if (list.isEmpty()) {
            System.out.println("No bookmarks found");
            return null;
        } else {
            for (BookmarkedPlace place : list) {
                TouristAttraction attraction = place.getEntityID().getTouristAttraction();
                if (attraction != null) {
                    //System.out.println(attraction.getName());
                    touristAttractions.add(attraction);
                }
            }
        }

        return touristAttractions;

    }


    public String addBookmark(String email,TouristAttraction bookmarkPlace){

        LocalDate date = LocalDate.now();
        User user = userRepo.findByEmail(email).orElseThrow();
        EntityType entityType = entityTypeRepo.findEntityTypeByTouristAttraction(bookmarkPlace).orElseThrow();
        BookmarkedPlace bookmarkedPlace = BookmarkedPlace.builder()
                    .user(user)
                    .entityID(entityType)
                    .date(date).
                    build();


        bookmarkedPlaceRepo.save(bookmarkedPlace);

        return "ok";
    }
}