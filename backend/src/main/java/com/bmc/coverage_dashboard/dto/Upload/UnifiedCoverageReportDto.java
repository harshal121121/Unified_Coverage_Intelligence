package com.bmc.coverage_dashboard.dto.Upload;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class UnifiedCoverageReportDto {


    private BuildDto build;

    private SummaryDto summary;

    private List<ModuleDto> modules;

    private SonarDto sonar;

    private List<QualityGateConditionDto> qualityGateConditions;

    private ProjectDto project;
}