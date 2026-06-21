package com.bmc.coverage_dashboard.dto.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RiskRatingResponse {

    private String riskRating;

    private Double weightedScore;

    private Integer criticalCount;

    private Integer blockerCount;

    private Integer vulnerabilityCount;

    private String color;
}