package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.BuildEntity;
import com.bmc.coverage_dashboard.entity.SonarMetricsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SonarMetricsRepository
        extends JpaRepository<SonarMetricsEntity, Long> {

    SonarMetricsEntity findTopByBugsIsNotNullOrderByIdDesc();
    SonarMetricsEntity findTopByOrderByIdDesc();
    SonarMetricsEntity
    findTopByBuildOrderByIdDesc(
            BuildEntity build);


}