package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;

@Data
public class ModuleDto {

    private String name;

    private String path;

    private String language;

    private Double lineCoverage;

    private Double branchCoverage;

    private Integer coveredLines;

    private Integer missedLines;

    private Integer coveredBranches;

    private Integer missedBranches;

    private String status;

    private String riskLevel;

    private String heatmapColor;
}