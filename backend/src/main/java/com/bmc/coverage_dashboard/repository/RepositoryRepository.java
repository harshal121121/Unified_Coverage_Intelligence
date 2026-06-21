package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.RepositoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositoryRepository
        extends JpaRepository<RepositoryEntity, Long> {

    Optional<RepositoryEntity> findByUrlAndBranch(
            String url,
            String branch);
}