package com.bmc.coverage_dashboard.controller;

import com.bmc.coverage_dashboard.dto.Upload.OllamaAnalysisUploadDto;
import com.bmc.coverage_dashboard.dto.Upload.UnifiedCoverageReportDto;
import com.bmc.coverage_dashboard.service.BuildUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/builds")
@RequiredArgsConstructor
public class BuildUploadController {

    private final BuildUploadService buildUploadService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadReport(
            @RequestBody UnifiedCoverageReportDto report) {

        buildUploadService.processCoverageReport(report);

        return ResponseEntity.ok(
                "Coverage report received");
    }
    @PostMapping(
            "/ollama-analysis")
    public ResponseEntity<String>
    uploadOllamaAnalysis(
            @RequestBody
            OllamaAnalysisUploadDto dto) {

        buildUploadService
                .processOllamaAnalysis(
                        dto);

        return ResponseEntity.ok(
                "Ollama analysis uploaded");
    }
}