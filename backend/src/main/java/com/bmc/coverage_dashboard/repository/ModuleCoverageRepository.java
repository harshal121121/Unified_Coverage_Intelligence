package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.ModuleCoverageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ModuleCoverageRepository
        extends JpaRepository<ModuleCoverageEntity, Long> {

    List<ModuleCoverageEntity> findAllByOrderByLineCoverageDesc();
    List<ModuleCoverageEntity>
    findByBuildId(
            Long buildId);
    Integer countByRiskLevel(String riskLevel);

    Integer countByLineCoverageLessThan(Double coverage);

}