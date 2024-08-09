package com.mapa.restapi.repo;

import com.mapa.restapi.model.PlanItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanItemsRepo extends JpaRepository<PlanItems, Integer> {
}
