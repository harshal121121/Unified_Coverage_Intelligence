package com.bmc.coverage_dashboard.dto.Upload;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiInsightsRequest {

    private String executiveSummary;

    private Map<String, String>
            coverageRiskInsight;

    private Map<String, String>
            codeQualityInsight;

    private Map<String, String>
            securityInsight;
}