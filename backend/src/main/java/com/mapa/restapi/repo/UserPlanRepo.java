package com.mapa.restapi.repo;

import com.mapa.restapi.model.User;
import com.mapa.restapi.model.UserPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPlanRepo extends JpaRepository<UserPlan, Long> {


    Optional<UserPlan> findByUser(User user);

    Optional<UserPlan> findByPlanID(long planID);

    @Query(value = "SELECT * FROM user_plan t WHERE t.user_id = ?1", nativeQuery = true)
    Optional<UserPlan> findByUserID(long userID);
}
