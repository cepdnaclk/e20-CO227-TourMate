package com.mapa.restapi.service;

import com.mapa.restapi.model.BookmarkedPlace;
import com.mapa.restapi.model.EntityType;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.model.User;
import com.mapa.restapi.repo.BookmarkedPlaceRepo;
import com.mapa.restapi.repo.EntityTypeRepo;
import com.mapa.restapi.repo.TouristAttractionRepo;
import com.mapa.restapi.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookmarkPlaceService {

    @Autowired
    private BookmarkedPlaceRepo bookmarkedPlaceRepo;

    @Autowired
    private TouristAttractionRepo touristAttractionRepo;

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
                TouristAttraction attraction = place.getAttraction_id();
                if (attraction != null) {
                    //System.out.println(attraction.getName());
                    touristAttractions.add(attraction);
                }
            }
        }

        return touristAttractions;

    }


    @Transactional
    public int addBookmark(String email,TouristAttraction attraction){

        LocalDate date = LocalDate.now();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        TouristAttraction existAttraction = touristAttractionRepo.findByName(attraction.getName()).orElse(null);

        if(existAttraction==null){
            existAttraction = touristAttractionRepo.save(attraction);
        }

        BookmarkedPlace bookmarkedPlace = BookmarkedPlace.builder()
                    .user(user)
                    .attraction_id(existAttraction)
                    .date(date).
                    build();


        bookmarkedPlaceRepo.save(bookmarkedPlace);

        return 1;
    }

    @Transactional
    public int removeBookmark(TouristAttraction attraction) {
        TouristAttraction existAttraction = touristAttractionRepo.findByName(attraction.getName()).orElse(null);
        if(existAttraction==null){return 0;}
        bookmarkedPlaceRepo.deleteByAttractionID(existAttraction.getAttractionID());
        return 1;
    }

    @Transactional
    public List<Long> getBookmarks(String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<BookmarkedPlace> bookmarks = bookmarkedPlaceRepo.findByUserID(user.getUserid()).orElse(null);
        if (bookmarks.isEmpty()) {
            System.out.println("No bookmarks found");
            return null;
        }
        List<Long> bookmarkIDs = new ArrayList<>();
        for (BookmarkedPlace place : bookmarks) {
           bookmarkIDs.add(place.getAttraction_id().getApiLocationId());
        }

        return bookmarkIDs;

    }
}