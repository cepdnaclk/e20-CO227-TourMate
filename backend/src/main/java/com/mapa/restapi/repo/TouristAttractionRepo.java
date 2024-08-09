package com.mapa.restapi.repo;

import com.mapa.restapi.model.TouristAttraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TouristAttractionRepo extends JpaRepository<TouristAttraction, Long> {

    @Query( value = "select * from tourist_attraction", nativeQuery = true)
    List<TouristAttraction> findTouristAttraction();
}
