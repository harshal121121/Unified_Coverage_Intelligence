package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageDistributionResponse {

    private Double javaCoverage;

    private Double cppCoverage;
}