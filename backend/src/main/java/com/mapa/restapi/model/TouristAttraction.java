package com.mapa.restapi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"entityID"})
public class TouristAttraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long attractionID;
    private String type;
    private String description;
    private String title;

    private String name;
    private String city;

    @Column(unique = true)
    private String coordinates;

    @OneToOne(
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "entityID"

    )
    private EntityType entityID;
}
