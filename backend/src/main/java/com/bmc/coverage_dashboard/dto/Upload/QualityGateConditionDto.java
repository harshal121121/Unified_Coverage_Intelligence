package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;

@Data
public class QualityGateConditionDto {

    private String metric;

    private String operator;

    private Double threshold;

    private Double actualValue;

    private String status;
}