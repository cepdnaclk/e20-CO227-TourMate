package com.mapa.restapi.repo;

import com.mapa.restapi.model.EntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntityTypeRepo extends JpaRepository<EntityType, Long> {

}
