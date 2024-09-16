package com.mapa.restapi.repo;

import com.mapa.restapi.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Extend JpaRepository to provide basic CRUD operations
public interface DestinationRepo extends JpaRepository<Destination, Long> {
    // Custom query method to find destinations by name (this is optional)
    List<Destination> findByDestinationNameContaining(String destinationName);
}
