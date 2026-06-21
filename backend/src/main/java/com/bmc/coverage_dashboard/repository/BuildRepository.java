package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.BuildEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface BuildRepository
        extends JpaRepository<BuildEntity, Long> {

    List<BuildEntity> findAllByOrderByIdDesc();
    BuildEntity findTopByOrderByIdDesc();

}