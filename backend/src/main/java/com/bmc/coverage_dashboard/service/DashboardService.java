package com.bmc.coverage_dashboard.service;

import com.bmc.coverage_dashboard.dto.Response.*;
import com.bmc.coverage_dashboard.dto.Upload.AiInsightsRequest;

import java.util.List;

public interface DashboardService {

    DashboardSummaryResponse getDashboardSummary();

    List<ModuleCoverageResponse> getModules();

    List<BuildHistoryResponse> getBuildHistory();

    List<CoverageTrendResponse> getCoverageTrend();

    LanguageDistributionResponse
    getLanguageDistribution();

    SonarSummaryResponse getSonarSummary();

    LatestBuildResponse getLatestBuild();

    ModuleDetailsResponse getModuleDetails(Long id);

    List<SonarIssueResponse> getSonarIssues();

    QualityGateResponse getQualityGate();

    List<QualityGateHistoryResponse>
    getQualityGateHistory();

    SonarIssueDetailsResponse
    getSonarIssue(String issueKey);
    SourceCodeResponse
    getSourceCode(
            String issueKey);

    AiInsightsResponse getAiInsights();
    AiMetricsResponse getAiMetrics();
    void saveAiInsights(
            AiInsightsRequest request);

    RiskRatingResponse getRiskRating();
    List<OllamaIssueResponse>
    getOllamaIssues();

    OllamaIssueResponse
    getOllamaIssue(
            String issueKey);
}