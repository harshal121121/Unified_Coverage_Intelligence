package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;

import java.util.List;

@Data
public class SonarDto {

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
    private List<SonarIssueDto> issues;

    private SonarSummaryDto summary;
}