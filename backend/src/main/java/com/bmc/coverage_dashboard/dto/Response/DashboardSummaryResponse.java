package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private Double overallCoverage;

    private Double javaCoverage;

    private Double cppCoverage;

    private Integer totalTests;

    private Integer passedTests;

    private Integer failedTests;

    private Integer bugs;

    private Integer vulnerabilities;

    private Integer codeSmells;
}