package com.bmc.coverage_dashboard.dto.Upload;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SonarSummaryDto {

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

    private Integer criticalIssues;

    private Integer majorIssues;

    private Integer minorIssues;

    private String lastAnalysisDate;

    
}