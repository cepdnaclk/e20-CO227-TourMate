package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"bookmarkedPlaces"})
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long attractionID;
    private String type;

    @Column(length = 1000)
    private String description;

    private String name;
    private String city;
    private String imgUrl;
    private String latitude;
    private String longitude;
    private String rating;
    private String web_url;
    private String phone;
    private Long apiLocationId;
    private String address;
    private String district;

    @OneToMany(cascade = CascadeType.ALL)
    private List<BookmarkedPlace> bookmarkedPlaces;
}
