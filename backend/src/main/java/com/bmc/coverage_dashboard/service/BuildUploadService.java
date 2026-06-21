package com.bmc.coverage_dashboard.service;

import com.bmc.coverage_dashboard.dto.Upload.OllamaAnalysisUploadDto;
import com.bmc.coverage_dashboard.dto.Upload.UnifiedCoverageReportDto;

public interface BuildUploadService {

    void processCoverageReport(
            UnifiedCoverageReportDto report);
    void processOllamaAnalysis(
            OllamaAnalysisUploadDto dto);

}