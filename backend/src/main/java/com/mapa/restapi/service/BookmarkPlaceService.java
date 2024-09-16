//package com.mapa.restapi.service;
//
//import com.mapa.restapi.model.BookmarkedPlace;
//import com.mapa.restapi.model.Destination;
//import com.mapa.restapi.model.User;
//import com.mapa.restapi.repo.BookmarkedPlaceRepo;
//import com.mapa.restapi.repo.DestinationRepo;
//import com.mapa.restapi.repo.UserRepo;
//import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class BookmarkPlaceService {
//
//    @Autowired
//    private BookmarkedPlaceRepo bookmarkedPlaceRepo;
//
//    @Autowired
//    private DestinationRepo destinationRepo;
//
//    @Autowired
//    private UserRepo userRepo;
//
//
//    public List<BookmarkedPlace> findBookMarks(long userID) {
//        return bookmarkedPlaceRepo.findByUserID(userID).orElse(null);
//    }
//
//    public List<Destination> findAttractionPlaces(long userID) {
//        List<Destination> destinations = new ArrayList<>();
//        List<BookmarkedPlace> list = findBookMarks(userID);
//        if (list.isEmpty()) {
//            System.out.println("No bookmarks found");
//            return null;
//        } else {
//            for (BookmarkedPlace place : list) {
//                Destination attraction = place.getAttraction_id();
//                if (attraction != null) {
//                    //System.out.println(attraction.getName());
//                    destinations.add(attraction);
//                }
//            }
//        }
//
//        return destinations;
//
//    }
//
//
//    @Transactional
//    public int addBookmark(String email, Destination attraction){
//
//        LocalDate date = LocalDate.now();
//        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
//
//        Destination existAttraction = destinationRepo.findByName(attraction.getName()).orElse(null);
//
//        if(existAttraction==null){
//            System.out.println("Saving");
//            existAttraction = destinationRepo.save(attraction);
//        }
//
//        BookmarkedPlace bookmarkedPlace = BookmarkedPlace.builder()
//                    .user(user)
//                    .attraction_id(existAttraction)
//                    .date(date).
//                    build();
//
//
//        bookmarkedPlaceRepo.save(bookmarkedPlace);
//
//        return 0; //return 0 if success
//    }
//
//    @Transactional
//    public int removeBookmark(Destination attraction) {
//        Destination existAttraction = destinationRepo.findByName(attraction.getName()).orElse(null);
//        if(existAttraction==null){return 0;}
//        bookmarkedPlaceRepo.deleteByAttractionID(existAttraction.getAttractionID());
//        return 1;
//    }
//
//    @Transactional
//    public List<Long> getBookmarks(String email) {
//        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
//        List<BookmarkedPlace> bookmarks = bookmarkedPlaceRepo.findByUserID(user.getUserid()).orElse(null);
//        if (bookmarks.isEmpty()) {
//            System.out.println("No bookmarks found");
//            return null;
//        }
//        List<Long> bookmarkIDs = new ArrayList<>();
//        for (BookmarkedPlace place : bookmarks) {
//           bookmarkIDs.add(place.getAttraction_id().getApiLocationId());
//        }
//
//        return bookmarkIDs;
//
//    }
//}