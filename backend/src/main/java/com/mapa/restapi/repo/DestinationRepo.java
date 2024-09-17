package com.mapa.restapi.repo;

import com.mapa.restapi.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepo extends JpaRepository<Destination, Long> {

    @Query( value = "select * from tourist_attraction", nativeQuery = true)
    List<Destination> findTouristAttraction();

    Optional<Destination> findByName(String name);

    List<Destination> findByNameContaining(String destinationName);
}
