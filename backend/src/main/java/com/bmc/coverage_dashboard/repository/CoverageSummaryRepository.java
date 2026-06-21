package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.BuildEntity;
import com.bmc.coverage_dashboard.entity.CoverageSummaryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface CoverageSummaryRepository

        extends JpaRepository<CoverageSummaryEntity, Long> {

    CoverageSummaryEntity findTopByOrderByIdDesc();
    CoverageSummaryEntity findByBuildId(Long buildId);
    CoverageSummaryEntity findByBuild(
            BuildEntity build);
}