package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
public class UserPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long planID;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_ID" ,unique = true)
    private User user;

    private LocalDate startDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate endDate;
    private String startLocation;
    private String endLocation;

//    @OneToMany
//    private List<BookmarkedPlace> bookmarkedPlaces;

//    @OneToMany(cascade = CascadeType.ALL , mappedBy = "planID",fetch = FetchType.EAGER)
//    private List<PlanItems> planItems;


}
