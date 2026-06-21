package com.bmc.coverage_dashboard.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coverage_summary", schema = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoverageSummaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double overallLineCoverage;

    private Double overallBranchCoverage;

    private Double javaCoverage;

    private Double cppCoverage;

    private Integer totalFiles;

    private Integer coveredFiles;

    private Integer partiallyCoveredFiles;

    private Integer uncoveredFiles;

    private Integer totalTests;

    private Integer passedTests;

    private Integer failedTests;

    private String qualityGate;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "build_id")
    private BuildEntity build;
}