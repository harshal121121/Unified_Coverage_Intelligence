package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;

@Data
public class SummaryDto {

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

}