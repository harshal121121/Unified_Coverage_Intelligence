package com.bmc.coverage_dashboard.dto.Response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SonarIssueDetailsResponse {

    private String issueKey;

    private String type;

    private String severity;

    private String softwareQuality;

    private String status;

    private String file;

    private Integer line;

    private String message;

    private String rule;

    private List<String> tags;

    private Integer effortMinutes;

    private String ruleDescription;

    private String recommendation;

    private String impact;
}