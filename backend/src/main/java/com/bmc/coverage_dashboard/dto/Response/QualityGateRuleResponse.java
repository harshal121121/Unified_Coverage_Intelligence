package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QualityGateRuleResponse {

    private String name;

    private String expected;

    private String actual;

    private String status;
}