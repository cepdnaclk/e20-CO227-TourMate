package com.mapa.restapi.controller;


import com.mapa.restapi.dto.TouristAttractionDTO;
import com.mapa.restapi.dto.UserDto;
import com.mapa.restapi.model.TouristAttraction;
import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import com.mapa.restapi.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PostMapping("/addBookmarks")
    public ResponseEntity<?> addBookmarks(@RequestBody TouristAttraction place , @AuthenticationPrincipal UserDetails userDetails){

        String username = userDetails.getUsername();
        String msg = bookmarkPlaceService.addBookmark(username,place);
        if (msg.equals("ok")){
            return ResponseEntity.ok("{\"msg\":\"Bookmark added successfully\"}");
        }
        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/create-plan")
    public ResponseEntity<?> createPlan(@RequestBody UserPlan plan, @AuthenticationPrincipal UserDetails userDetails){

        String username = userDetails.getUsername();

        userPlanService.addPlan(plan,username);

        return ResponseEntity.ok("Plan created");

        //return ResponseEntity.badRequest().body(null);
    }

    @GetMapping("/getUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getUsers() {

        return userService.getAllUsers();
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

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return "Deleted";
    }



}