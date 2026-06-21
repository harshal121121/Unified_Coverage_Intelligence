package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QualityGateResponse {

    private String status;

    private Integer score;

    private Integer passedRules;

    private Integer failedRules;

    private List<QualityGateRuleResponse> rules;
}