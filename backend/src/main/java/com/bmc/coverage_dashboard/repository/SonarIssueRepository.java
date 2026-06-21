package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.SonarIssueEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SonarIssueRepository
        extends JpaRepository<SonarIssueEntity, Long> {


    List<SonarIssueEntity>
    findAllByOrderByIdDesc();
    SonarIssueEntity
    findTopByIssueKeyOrderByIdDesc(
            String issueKey);
    List<SonarIssueEntity>
    findByBuildIdAndStatus(
            Long buildId,
            String status);
}