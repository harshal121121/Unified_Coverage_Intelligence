package com.bmc.coverage_dashboard.controller;

import com.bmc.coverage_dashboard.dto.Response.*;
import com.bmc.coverage_dashboard.dto.Upload.AiInsightsRequest;
import com.bmc.coverage_dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {

        return dashboardService.getDashboardSummary();
    }
    @GetMapping("/modules")

    public List<ModuleCoverageResponse> getModules() {

        return dashboardService.getModules();
    }
    @GetMapping("/build-history")
    public List<BuildHistoryResponse> getBuildHistory() {

        return dashboardService.getBuildHistory();
    }
    @GetMapping("/coverage-trend")
    public List<CoverageTrendResponse>
    getCoverageTrend() {

        return dashboardService.getCoverageTrend();
    }
    @GetMapping("/language-distribution")
    public LanguageDistributionResponse
    getLanguageDistribution() {

        return dashboardService
                .getLanguageDistribution();
    }
    @GetMapping("/sonar-summary")
    public SonarSummaryResponse
    getSonarSummary() {

        return dashboardService
                .getSonarSummary();
    }
    @GetMapping("/latest-build")
    public LatestBuildResponse getLatestBuild() {

        return dashboardService.getLatestBuild();
    }
    @GetMapping("/modules/{id}")
    public ModuleDetailsResponse getModuleDetails(
            @PathVariable Long id) {

        return dashboardService
                .getModuleDetails(id);
    }
    @GetMapping("/sonar-issues")
    public ResponseEntity<List<SonarIssueResponse>>
    getSonarIssues() {

        return ResponseEntity.ok(
                dashboardService.getSonarIssues());
    }
    @GetMapping("/quality-gate")
    public QualityGateResponse getQualityGate() {

        return dashboardService
                .getQualityGate();
    }
    @GetMapping("/quality-gate-history")
    public List<QualityGateHistoryResponse>
    getQualityGateHistory() {

        return dashboardService
                .getQualityGateHistory();
    }
    @GetMapping("/sonar-issues/{issueKey}")
    public SonarIssueDetailsResponse
    getSonarIssue(
            @PathVariable String issueKey) {

        return dashboardService
                .getSonarIssue(issueKey);
    }
    @GetMapping(
            "/sonar-issues/{issueKey}/source")
    public SourceCodeResponse
    getSourceCode(
            @PathVariable String issueKey) {

        return dashboardService
                .getSourceCode(
                        issueKey);
    }
    @GetMapping("/ai-insights")
    public AiInsightsResponse
    getAiInsights() {

        return dashboardService
                .getAiInsights();
    }
    @GetMapping("/ai-metrics")
    public AiMetricsResponse
    getAiMetrics() {

        return dashboardService
                .getAiMetrics();
    }
    @PostMapping("/ai-insights")
    public ResponseEntity<String>
    saveAiInsights(
            @RequestBody
            AiInsightsRequest request) {

        dashboardService
                .saveAiInsights(request);

        return ResponseEntity.ok(
                "AI insights saved successfully");
    }
    @GetMapping("/risk-rating")
    public RiskRatingResponse getRiskRating() {

        return dashboardService.getRiskRating();
    }
    @GetMapping(
            "/ollama-issues")
    public List<OllamaIssueResponse>
    getOllamaIssues() {

        return dashboardService
                .getOllamaIssues();
    }
    @GetMapping(
            "/ollama-issues/{issueKey}")
    public OllamaIssueResponse
    getOllamaIssue(
            @PathVariable
            String issueKey) {

        return dashboardService
                .getOllamaIssue(
                        issueKey);
    }

}