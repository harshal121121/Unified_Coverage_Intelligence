package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;

import java.util.List;

@Data
public class SonarIssueDto {

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

    private List<String> tags;

    private String ruleDescription;

    private String recommendation;

    private String impact;
}