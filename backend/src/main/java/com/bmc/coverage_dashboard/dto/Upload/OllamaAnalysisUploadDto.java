package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OllamaAnalysisUploadDto {

    private Integer totalIssues;

    private Integer uniqueRules;

    private List<OllamaIssueDto>
            issues;
}