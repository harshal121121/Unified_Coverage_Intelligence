package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiMetricsResponse {

    private Double riskIndex;

    private Integer highRiskFiles;

    private Integer coverageGaps;

    private Double currentCoverage;

    private Double targetCoverage;

    private Double potentialGain;
}