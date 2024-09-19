package com.mapa.restapi.controller;


import com.mapa.restapi.dto.UserDto;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import com.mapa.restapi.service.BookmarkPlaceService;
import com.mapa.restapi.service.UserPlanService;
import com.mapa.restapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins="*")  //allow for all the ports
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BookmarkPlaceService bookmarkPlaceService;

    @Autowired
    private UserPlanService userPlanService;

    @PostMapping("/addbookmarks")
    public ResponseEntity<?> addBookmarks(@RequestBody TouristAttraction place , @AuthenticationPrincipal UserDetails userDetails){

        String username = userDetails.getUsername();
        int code = bookmarkPlaceService.addBookmark(username,place);
        if (code==0){
            return ResponseEntity.ok().body("Bookmark added successfully");
        }
        return ResponseEntity.badRequest().body("Bookmark could not be added");
    }

    @PostMapping("/removebookmark")
    public ResponseEntity<?> removeBookmarks(@RequestBody TouristAttraction place){

        int code = bookmarkPlaceService.removeBookmark(place);
        if (code==0){
            return ResponseEntity.ok().body("Bookmark removed");
        }
        return ResponseEntity.badRequest().body("Error while removing bookmark");
    }

    //Get Bookmark Id
    @GetMapping("/getbookmarks")
    public ResponseEntity<?> getBookmarks(@AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        List<Long> code = bookmarkPlaceService.getBookmarks(username);
        return ResponseEntity.ok().body(code);
    }

    @PostMapping("/create-plan")
    public ResponseEntity<?> createPlan(@RequestBody UserPlan plan, @AuthenticationPrincipal UserDetails userDetails){

        String username = userDetails.getUsername();

        userPlanService.addPlan(plan,username);

        return ResponseEntity.ok("Plan created");

    }


    @PostMapping("/signup")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email Already Registered");
        }

        UserDto userdto = userService.saveUser(user);
        if (userdto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        System.out.println(userdto);
        return ResponseEntity.status(HttpStatus.OK).body(userdto);
    }

    @PostMapping("/addPlan")
    public ResponseEntity<?> addPlan(@RequestBody UserPlan plan,@AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        userPlanService.addPlan(plan,username);
        return ResponseEntity.ok().body("Plan added");
    }




}