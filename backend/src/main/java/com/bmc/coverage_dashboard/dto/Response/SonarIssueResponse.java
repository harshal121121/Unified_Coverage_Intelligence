package com.bmc.coverage_dashboard.dto.Response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SonarIssueResponse {

    private String issueKey;

    private String type;

    private String severity;

    private String rule;

    private String file;

    private Integer line;

    private String message;

    private String status;

    private Integer effortMinutes;

    private String softwareQuality;

    private String tags;

    private String ruleDescription;

    private String recommendation;

    private String impact;
}