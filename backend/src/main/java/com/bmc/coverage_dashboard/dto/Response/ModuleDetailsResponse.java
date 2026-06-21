package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleDetailsResponse {

    private Long id;

    private String moduleName;

    private String modulePath;

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