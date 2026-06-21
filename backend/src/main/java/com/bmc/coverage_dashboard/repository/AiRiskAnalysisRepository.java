package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.AiRiskAnalysisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiRiskAnalysisRepository
        extends JpaRepository<
        AiRiskAnalysisEntity,
        Long> {

    AiRiskAnalysisEntity
    findTopByOrderByIdDesc();
}