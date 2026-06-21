package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.OllamaIssueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OllamaIssueRepository
        extends JpaRepository<
                OllamaIssueEntity,
                Long> {

    List<OllamaIssueEntity>
    findByBuildId(
            Long buildId);

    Optional<OllamaIssueEntity>
    findByIssueKeyAndBuildId(
            String issueKey,
            Long buildId);


}