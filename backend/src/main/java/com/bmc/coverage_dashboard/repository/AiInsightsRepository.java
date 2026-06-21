package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.AiInsightsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiInsightsRepository
        extends JpaRepository<
        AiInsightsEntity,
        Long> {

    Optional<AiInsightsEntity>
    findTopByBuildIdOrderByIdDesc(
            Long buildId);
}