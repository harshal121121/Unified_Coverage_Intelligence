package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class OllamaIssueDto {

    private String issueKey;
    private String rule;
    private String type;
    private String severity;
    private String file;
    private Integer line;

    private Object rootCause;

    private Object exactFix;

    private Object suggestedCode;

    private Object estimatedImpact;
}