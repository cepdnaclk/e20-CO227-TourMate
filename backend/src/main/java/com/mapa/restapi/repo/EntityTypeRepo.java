package com.mapa.restapi.repo;

import com.mapa.restapi.model.EntityType;
import com.mapa.restapi.model.TouristAttraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntityTypeRepo extends JpaRepository<EntityType, Long> {

}
