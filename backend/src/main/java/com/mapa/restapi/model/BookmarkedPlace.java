package com.mapa.restapi.model;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user","entityID"})
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "entity_id"})})
public class BookmarkedPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long bookmarkID;

    private LocalDate date;

    @ManyToOne (fetch = FetchType.EAGER)
    @JoinColumn(name = "entity_id")
    private EntityType entityID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
