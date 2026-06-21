package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SonarSummaryResponse {

    private Integer bugs;

    private Integer vulnerabilities;

    private Integer codeSmells;

    private Integer securityHotspots;

    private String securityRating;

    private String reliabilityRating;

    private String maintainabilityRating;

    private Integer technicalDebtMinutes;

    private Integer duplicatedLines;

    private Integer duplicatedBlocks;

    private Double duplicatedLinesDensity;

    private Double criticalIssues;

    private Double majorIssues;

    private Double minorIssues;


}