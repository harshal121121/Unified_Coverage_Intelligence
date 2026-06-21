package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleCoverageResponse {

    private Long id;
    private String moduleName;

    private String language;

    private Double lineCoverage;

    private Double branchCoverage;

    private String status;

    private String riskLevel;

    private String heatmapColor;
}