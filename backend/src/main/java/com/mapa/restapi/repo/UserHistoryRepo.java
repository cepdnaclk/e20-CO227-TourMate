package com.mapa.restapi.repo;

import com.mapa.restapi.model.UserHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserHistoryRepo extends JpaRepository<UserHistory, Long> {
}
