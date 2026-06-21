package com.bmc.coverage_dashboard.repository;

import com.bmc.coverage_dashboard.entity.RawReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RawReportRepository
        extends JpaRepository<RawReportEntity, Long> {
}