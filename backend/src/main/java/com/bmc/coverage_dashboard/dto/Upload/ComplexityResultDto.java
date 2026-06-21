package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;

@Data
public class ComplexityResultDto {

    private String moduleName;

    private String filePath;

    private String timeComplexity;

    private String reason;

    private String optimizationSuggestion;

    private String estimatedImprovedComplexity;

    private String hash;
}