package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoverageTrendResponse {

    private Integer buildNumber;

    private Double coverage;
}