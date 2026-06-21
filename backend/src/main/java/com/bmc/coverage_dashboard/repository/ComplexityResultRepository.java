package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.ComplexityResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplexityResultRepository
        extends JpaRepository<ComplexityResultEntity, Long> {
}