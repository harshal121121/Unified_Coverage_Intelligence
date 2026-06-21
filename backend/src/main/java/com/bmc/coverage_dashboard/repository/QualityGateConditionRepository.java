package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.QualityGateConditionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QualityGateConditionRepository
        extends JpaRepository<
        QualityGateConditionEntity,
        Long> {
}