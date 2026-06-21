package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QualityGateHistoryResponse {

    private Integer buildNumber;

    private String status;

    private Integer score;

    private Double coverage;

    private Integer bugs;

    private Integer vulnerabilities;
}