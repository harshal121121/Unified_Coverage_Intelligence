package com.bmc.coverage_dashboard.dto.Response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OllamaIssueResponse {

    private String issueKey;

    private String rule;

    private String severity;

    private String type;

    private String file;

    private Integer line;

    private String rootCause;

    private String exactFix;

    private String suggestedCode;

    private String estimatedImpact;
}