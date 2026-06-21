package com.bmc.coverage_dashboard.service.impl;

import com.bmc.coverage_dashboard.dto.Response.*;
import com.bmc.coverage_dashboard.dto.Upload.AiInsightsRequest;
import com.bmc.coverage_dashboard.entity.*;
import com.bmc.coverage_dashboard.repository.*;
import com.bmc.coverage_dashboard.service.DashboardService;
import com.bmc.coverage_dashboard.service.GitHubService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class DashboardServiceImpl
        implements DashboardService {
    private final ModuleCoverageRepository moduleCoverageRepository;
    private final CoverageSummaryRepository repository;
    private final SonarMetricsRepository sonarMetricsRepository;
    private final BuildRepository buildRepository;
    private final SonarIssueRepository sonarIssueRepository;
    private final CoverageSummaryRepository coverageSummaryRepository;
    private final GitHubService gitHubService;
    private final AiRiskAnalysisRepository
            aiRiskAnalysisRepository;
    private final OllamaIssueRepository
            ollamaIssueRepository;
    private final AiInsightsRepository
            aiInsightsRepository;


    private final ObjectMapper
            objectMapper;

    @Override
    public DashboardSummaryResponse getDashboardSummary() {

        CoverageSummaryEntity summary =
                repository.findTopByOrderByIdDesc();

        SonarMetricsEntity sonar =
                sonarMetricsRepository
                        .findTopByBugsIsNotNullOrderByIdDesc();

        if (summary == null) {
            return new DashboardSummaryResponse();
        }

        return DashboardSummaryResponse.builder()
                .overallCoverage(
                        summary.getOverallLineCoverage())
                .javaCoverage(
                        summary.getJavaCoverage())
                .cppCoverage(
                        summary.getCppCoverage())
                .totalTests(
                        summary.getTotalTests())
                .passedTests(
                        summary.getPassedTests())
                .failedTests(
                        summary.getFailedTests())
                .bugs(
                        sonar != null ? sonar.getBugs() : 0)
                .vulnerabilities(
                        sonar != null
                                ? sonar.getVulnerabilities()
                                : 0)
                .codeSmells(
                        sonar != null
                                ? sonar.getCodeSmells()
                                : 0)
                .build();
    }

    @Override
    public List<ModuleCoverageResponse>
    getModules() {

        BuildEntity latestBuild =
                buildRepository
                        .findTopByOrderByIdDesc();

        if (latestBuild == null) {

            return List.of();
        }

        List<ModuleCoverageEntity>
                modules =
                moduleCoverageRepository
                        .findByBuildId(
                                latestBuild.getId());

        return modules.stream()
                .map(module ->
                        ModuleCoverageResponse
                                .builder()
                                .id(
                                        module.getId())
                                .moduleName(
                                        module.getModuleName())
                                .language(
                                        module.getLanguage())
                                .lineCoverage(
                                        module.getLineCoverage())
                                .branchCoverage(
                                        module.getBranchCoverage())
                                .status(
                                        module.getStatus())
                                .riskLevel(
                                        module.getRiskLevel())
                                .heatmapColor(
                                        module.getHeatmapColor())
                                .build())
                .toList();
    }

    @Override
    public List<BuildHistoryResponse> getBuildHistory() {

        return buildRepository
                .findAllByOrderByIdDesc()
                .stream()
                .map(build -> {

                    CoverageSummaryEntity summary =
                            repository.findByBuildId(
                                    build.getId());

                    return BuildHistoryResponse.builder()
                            .buildId(build.getId())
                            .buildNumber(
                                    build.getBuildNumber())
                            .status(
                                    build.getStatus())
                            .coverage(
                                    summary != null
                                            ? summary.getOverallLineCoverage()
                                            : 0.0)
                            .repositoryName(
                                    build.getRepository()
                                            .getName())
                            .buildTime(
                                    build.getCreatedAt())
                            .build();
                })
                .toList();
    }

    @Override
    public List<CoverageTrendResponse> getCoverageTrend() {

        return buildRepository
                .findAllByOrderByIdDesc()
                .stream()
                .map(build -> {

                    CoverageSummaryEntity summary =
                            repository.findByBuildId(
                                    build.getId());

                    return CoverageTrendResponse.builder()
                            .buildNumber(
                                    build.getBuildNumber())
                            .coverage(
                                    summary != null
                                            ? summary.getOverallLineCoverage()
                                            : 0.0)
                            .build();
                })
                .toList();
    }

    @Override
    public LanguageDistributionResponse
    getLanguageDistribution() {

        CoverageSummaryEntity summary =
                repository.findTopByOrderByIdDesc();

        if (summary == null) {
            return new LanguageDistributionResponse();
        }

        return LanguageDistributionResponse.builder()
                .javaCoverage(
                        summary.getJavaCoverage())
                .cppCoverage(
                        summary.getCppCoverage())
                .build();
    }

    @Override
    public SonarSummaryResponse getSonarSummary() {

        SonarMetricsEntity sonar =
                sonarMetricsRepository
                        .findTopByBugsIsNotNullOrderByIdDesc();
        ;

        if (sonar == null) {
            return new SonarSummaryResponse();
        }

        return SonarSummaryResponse.builder()
                .bugs(
                        sonar.getBugs())
                .vulnerabilities(
                        sonar.getVulnerabilities())
                .codeSmells(
                        sonar.getCodeSmells())
                .securityHotspots(
                        sonar.getSecurityHotspots())
                .securityRating(
                        sonar.getSecurityRating())
                .reliabilityRating(
                        sonar.getReliabilityRating())
                .maintainabilityRating(
                        sonar.getMaintainabilityRating())
                .technicalDebtMinutes(
                        sonar.getTechnicalDebtMinutes())
                .duplicatedLines(
                        sonar.getDuplicatedLines())
                .duplicatedBlocks(
                        sonar.getDuplicatedBlocks())
                .duplicatedLinesDensity(
                        sonar.getDuplicatedLinesDensity())
                .criticalIssues(
                        sonar.getCriticalIssues())
                .majorIssues(
                        sonar.getMajorIssues())
                .minorIssues(
                        sonar.getMinorIssues())
                .build();
    }

    @Override
    public LatestBuildResponse getLatestBuild() {

        BuildEntity build =
                buildRepository.findTopByOrderByIdDesc();

        if (build == null) {
            return new LatestBuildResponse();
        }

        CoverageSummaryEntity summary =
                repository.findByBuildId(build.getId());

        return LatestBuildResponse.builder()
                .buildId(build.getId())
                .buildNumber(build.getBuildNumber())
                .status(build.getStatus())
                .coverage(
                        summary != null
                                ? summary.getOverallLineCoverage()
                                : 0.0)
                .repositoryName(
                        build.getRepository().getName())
                .branch(
                        build.getRepository().getBranch())
                .author(
                        build.getAuthor())
                .commitId(
                        build.getCommitId())
                .commitMessage(
                        build.getCommitMessage())
                .durationSeconds(
                        build.getDurationSeconds())
                .startTime(
                        build.getStartTime())
                .endTime(
                        build.getEndTime())
                .build();
    }

    @Override
    public ModuleDetailsResponse getModuleDetails(
            Long id) {

        ModuleCoverageEntity module =
                moduleCoverageRepository
                        .findById(id)
                        .orElse(null);

        if (module == null) {
            return new ModuleDetailsResponse();
        }

        return ModuleDetailsResponse.builder()
                .id(module.getId())
                .moduleName(module.getModuleName())
                .modulePath(module.getModulePath())
                .language(module.getLanguage())
                .lineCoverage(module.getLineCoverage())
                .branchCoverage(module.getBranchCoverage())
                .coveredLines(module.getCoveredLines())
                .missedLines(module.getMissedLines())
                .coveredBranches(module.getCoveredBranches())
                .missedBranches(module.getMissedBranches())
                .status(module.getStatus())
                .riskLevel(module.getRiskLevel())
                .heatmapColor(module.getHeatmapColor())
                .build();
    }

    @Override
    public List<SonarIssueResponse> getSonarIssues() {

        return sonarIssueRepository
                .findAllByOrderByIdDesc()
                .stream()
                .map(issue ->
                        SonarIssueResponse.builder()
                                .issueKey(issue.getIssueKey())
                                .type(issue.getType())
                                .severity(issue.getSeverity())
                                .rule(issue.getRuleName())
                                .file(issue.getFilePath())
                                .line(issue.getLineNumber())
                                .message(issue.getMessage())
                                .status(issue.getStatus())
                                .effortMinutes(
                                        issue.getEffortMinutes())
                                .softwareQuality(
                                        issue.getSoftwareQuality())
                                .tags(issue.getTags())
                                .build())
                .toList();
    }

    @Override
    public QualityGateResponse getQualityGate() {

        CoverageSummaryEntity summary =
                coverageSummaryRepository
                        .findTopByOrderByIdDesc();

        SonarMetricsEntity sonar =
                sonarMetricsRepository
                        .findTopByBugsIsNotNullOrderByIdDesc();

        if (summary == null || sonar == null) {
            return QualityGateResponse.builder()
                    .status("UNKNOWN")
                    .score(0)
                    .passedRules(0)
                    .failedRules(0)
                    .rules(List.of())
                    .build();
        }

        List<QualityGateRuleResponse> rules =
                new ArrayList<>();

        int passed = 0;
        int failed = 0;

        // Coverage Rule

        boolean coveragePass =
                summary.getOverallLineCoverage() >= 60;

        rules.add(
                QualityGateRuleResponse.builder()
                        .name("Coverage")
                        .expected(">= 60")
                        .actual(
                                String.valueOf(
                                        summary.getOverallLineCoverage()))
                        .status(
                                coveragePass ? "PASS" : "FAIL")
                        .build());

        if (coveragePass) passed++;
        else failed++;

        // Bugs Rule

        boolean bugsPass =
                sonar.getBugs() <= 10;

        rules.add(
                QualityGateRuleResponse.builder()
                        .name("Bugs")
                        .expected("<= 10")
                        .actual(
                                String.valueOf(
                                        sonar.getBugs()))
                        .status(
                                bugsPass ? "PASS" : "FAIL")
                        .build());

        if (bugsPass) passed++;
        else failed++;

        // Vulnerability Rule

        boolean vulnPass =
                sonar.getVulnerabilities() <= 5;

        rules.add(
                QualityGateRuleResponse.builder()
                        .name("Vulnerabilities")
                        .expected("<= 5")
                        .actual(
                                String.valueOf(
                                        sonar.getVulnerabilities()))
                        .status(
                                vulnPass ? "PASS" : "FAIL")
                        .build());

        if (vulnPass) passed++;
        else failed++;

        // Security Rule


        int score =
                (passed * 100) / 3;

        return QualityGateResponse.builder()
                .status(
                        failed > 0
                                ? "FAILED"
                                : "PASSED")
                .score(score)
                .passedRules(passed)
                .failedRules(failed)
                .rules(rules)
                .build();
    }

    @Override
    public List<QualityGateHistoryResponse>
    getQualityGateHistory() {

        List<BuildEntity> builds =
                buildRepository.findAllByOrderByIdDesc();

        List<QualityGateHistoryResponse> result =
                new ArrayList<>();

        for (BuildEntity build : builds) {

            CoverageSummaryEntity summary =
                    coverageSummaryRepository
                            .findByBuild(build);

            SonarMetricsEntity sonar =
                    sonarMetricsRepository
                            .findTopByBuildOrderByIdDesc(build);

            if (summary == null || sonar == null) {
                continue;
            }

            int score = 0;

            // Coverage Check
            if (summary.getOverallLineCoverage() >= 60) {
                score += 34;
            }

            // Bugs Check
            if (sonar.getBugs() != null
                    && sonar.getBugs() <= 10) {
                score += 33;
            }

            // Vulnerability Check
            if (sonar.getVulnerabilities() != null
                    && sonar.getVulnerabilities() <= 5) {
                score += 33;
            }

            result.add(
                    QualityGateHistoryResponse.builder()
                            .buildNumber(
                                    build.getBuildNumber())
                            .status(
                                    score == 100
                                            ? "PASSED"
                                            : "FAILED")
                            .score(score)
                            .coverage(
                                    summary.getOverallLineCoverage())
                            .bugs(
                                    sonar.getBugs())
                            .vulnerabilities(
                                    sonar.getVulnerabilities())
                            .build()
            );
        }

        return result;
    }

    @Override
    public SonarIssueDetailsResponse
    getSonarIssue(String issueKey) {

        SonarIssueEntity issue =
                sonarIssueRepository
                        .findTopByIssueKeyOrderByIdDesc(
                                issueKey);

        if (issue == null) {
            throw new RuntimeException(
                    "Issue not found");
        }

        return SonarIssueDetailsResponse.builder()
                .issueKey(
                        issue.getIssueKey())
                .type(
                        issue.getType())
                .severity(
                        issue.getSeverity())
                .softwareQuality(
                        issue.getSoftwareQuality())
                .status(
                        issue.getStatus())
                .file(issue.getFilePath())
                .line(issue.getLineNumber())
                .message(
                        issue.getMessage())
                .rule(
                        issue.getRuleName()) // java:S2076
                .tags(
                        issue.getTags() == null
                                ? List.of()
                                : List.of(issue.getTags().split(","))
                )
                .effortMinutes(
                        issue.getEffortMinutes())
                .ruleDescription(
                        issue.getRuleDescription())
                .recommendation(
                        issue.getRecommendation())
                .impact(
                        issue.getImpact())
                .build();
    }

    @Override
    @Transactional
    public SourceCodeResponse
    getSourceCode(
            String issueKey) {

        SonarIssueEntity issue =
                sonarIssueRepository
                        .findTopByIssueKeyOrderByIdDesc(
                                issueKey);

        if (issue == null) {
            throw new RuntimeException(
                    "Issue not found");
        }

        BuildEntity build =
                issue.getBuild();

        RepositoryEntity repository =
                build.getRepository();

        String source =
                gitHubService.getFileContent(
                        repository.getUrl(),
                        repository.getBranch(),
                        issue.getFilePath());

        String[] lines =
                source.split("\n");

        List<SourceLineResponse> result =
                new ArrayList<>();

        for (int i = 0; i < lines.length; i++) {

            result.add(
                    SourceLineResponse.builder()
                            .line(i + 1)
                            .code(lines[i])
                            .build());
        }

        return SourceCodeResponse.builder()
                .file(
                        issue.getFilePath())
                .highlightLine(
                        issue.getLineNumber())
                .source(
                        result)
                .build();
    }

    @Override
    public AiInsightsResponse
    getAiInsights() {

        BuildEntity latestBuild =
                buildRepository
                        .findTopByOrderByIdDesc();

        if (latestBuild == null) {

            return new AiInsightsResponse();
        }

        Optional<AiInsightsEntity>
                entityOpt =
                aiInsightsRepository
                        .findTopByBuildIdOrderByIdDesc(
                                latestBuild.getId());

        if (entityOpt.isEmpty()) {

            return new AiInsightsResponse();
        }

        try {

            return objectMapper
                    .readValue(
                            entityOpt
                                    .get()
                                    .getAnalysisJson(),
                            AiInsightsResponse.class);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse AI insights",
                    e);
        }
    }
    @Override
    public AiMetricsResponse getAiMetrics() {

        CoverageSummaryEntity summary =
                coverageSummaryRepository
                        .findTopByOrderByIdDesc();

        SonarMetricsEntity sonar =
                sonarMetricsRepository
                        .findTopByOrderByIdDesc();

        if (summary == null || sonar == null) {

            return new AiMetricsResponse();
        }

        Integer highRiskFiles =
                moduleCoverageRepository
                        .countByRiskLevel("HIGH");

        Integer coverageGaps =
                moduleCoverageRepository
                        .countByLineCoverageLessThan(
                                80.0);

        double currentCoverage =
                summary.getOverallLineCoverage();

        double targetCoverage =
                Math.min(
                        currentCoverage
                                + (coverageGaps * 0.15),
                        80.0);

        double potentialGain =
                targetCoverage
                        - currentCoverage;

        double coverageRisk =
                (100 - currentCoverage)
                        * 0.05;

        double codeSmellRisk =
                sonar.getCodeSmells()
                        * 0.01;

        double securityRisk =
                sonar.getVulnerabilities()
                        * 0.5;

        double bugRisk =
                sonar.getBugs()
                        * 0.2;

        double fileRisk =
                highRiskFiles
                        * 0.1;

        double riskIndex =
                coverageRisk
                        + codeSmellRisk
                        + securityRisk
                        + bugRisk
                        + fileRisk;

        riskIndex =
                Math.min(
                        riskIndex,
                        10.0);

        return AiMetricsResponse.builder()
                .riskIndex(
                        Math.round(
                                riskIndex * 10.0)
                                / 10.0)

                .highRiskFiles(
                        highRiskFiles)

                .coverageGaps(
                        coverageGaps)

                .currentCoverage(
                        currentCoverage)

                .targetCoverage(
                        Math.round(
                                targetCoverage * 10.0)
                                / 10.0)

                .potentialGain(
                        Math.round(
                                potentialGain * 10.0)
                                / 10.0)

                .build();
    }

    @Override
    @Transactional
    public void saveAiInsights(
            AiInsightsRequest request) {

        BuildEntity latestBuild =
                buildRepository
                        .findTopByOrderByIdDesc();

        if (latestBuild == null) {

            throw new RuntimeException(
                    "No build found");
        }

        try {

            AiInsightsEntity entity =
                    AiInsightsEntity
                            .builder()
                            .build(latestBuild)
                            .analysisJson(
                                    objectMapper
                                            .writeValueAsString(
                                                    request))
                            .createdAt(
                                    LocalDateTime.now())
                            .build();

            aiInsightsRepository
                    .save(entity);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to save AI insights",
                    e);
        }
    }
    @Override
    public RiskRatingResponse getRiskRating() {

        BuildEntity latestBuild =
                buildRepository
                        .findTopByOrderByIdDesc();

        if (latestBuild == null) {

            return RiskRatingResponse.builder()
                    .riskRating("LOW")
                    .weightedScore((double) 0L)
                    .criticalCount(0)
                    .vulnerabilityCount(0)
                    .color("var(--google-green-600)")
                    .build();
        }

        List<SonarIssueEntity> issues =
                sonarIssueRepository
                        .findByBuildIdAndStatus(
                                latestBuild.getId(),
                                "OPEN");

        double totalScore = 0;

        int criticalCount = 0;
        int vulnerabilityCount = 0;

        boolean blockerVulnerability = false;

        for (SonarIssueEntity issue : issues) {

            String severity = issue.getSeverity() == null
                    ? "INFO"
                    : issue.getSeverity().toUpperCase();

            String type = issue.getType() == null
                    ? "CODE_SMELL"
                    : issue.getType().toUpperCase();

            int severityWeight;

            switch (severity) {
                case "BLOCKER":
                    severityWeight = 100;
                    break;

                case "CRITICAL":
                    severityWeight = 50;
                    criticalCount++;
                    break;

                case "MAJOR":
                    severityWeight = 20;
                    break;

                case "MINOR":
                    severityWeight = 5;
                    break;

                default:
                    severityWeight = 1;
            }

            double typeMultiplier;

            switch (type) {
                case "VULNERABILITY":

                    typeMultiplier = 1.5;
                    vulnerabilityCount++;

                    if ("BLOCKER".equals(severity)) {
                        blockerVulnerability = true;
                    }
                    break;

                case "BUG":
                    typeMultiplier = 1.2;
                    break;

                default:
                    typeMultiplier = 1.0;
            }

            totalScore += severityWeight * typeMultiplier;
        }

        String riskRating;
        String color;

        if (blockerVulnerability
                || criticalCount >= 100
                || vulnerabilityCount >= 10) {

            riskRating = "CRITICAL";
            color = "var(--google-red-800)";

        } else if (criticalCount >= 50
                || vulnerabilityCount >= 3) {

            riskRating = "HIGH";
            color = "var(--google-red-600)";

        } else if (criticalCount >= 10
                || totalScore >= 500) {

            riskRating = "MEDIUM";
            color = "var(--bmc-orange)";

        } else {

            riskRating = "LOW";
            color = "var(--google-green-600)";
        }

        return RiskRatingResponse.builder()
                .riskRating(riskRating)
                .weightedScore((double) Math.round(totalScore))
                .criticalCount(criticalCount)
                .vulnerabilityCount(vulnerabilityCount)
                .color(color)
                .build();
    }
    @Override
    public List<OllamaIssueResponse>
    getOllamaIssues() {

        try {

            BuildEntity latestBuild =
                    buildRepository
                            .findTopByOrderByIdDesc();

            System.out.println(
                    "Latest Build = "
                            + latestBuild.getId());

            List<OllamaIssueEntity> issues =
                    ollamaIssueRepository
                            .findByBuildId(
                                    latestBuild.getId());

            System.out.println(
                    "Issue Count = "
                            + issues.size());

            return issues.stream()
                    .map(issue ->
                            OllamaIssueResponse
                                    .builder()
                                    .issueKey(
                                            issue.getIssueKey())
                                    .rule(
                                            issue.getRuleKey())
                                    .severity(
                                            issue.getSeverity())
                                    .type(
                                            issue.getIssueType())
                                    .file(
                                            issue.getFilePath())
                                    .line(
                                            issue.getLineNumber())
                                    .rootCause(
                                            issue.getRootCause())
                                    .exactFix(
                                            issue.getExactFix())
                                    .suggestedCode(
                                            issue.getSuggestedCode())
                                    .estimatedImpact(
                                            issue.getEstimatedImpact())
                                    .build())
                    .toList();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to process issue: "

                    ,e);
        }
    }
    @Override
    public OllamaIssueResponse
    getOllamaIssue(
            String issueKey) {



        BuildEntity latestBuild =
                buildRepository
                        .findTopByOrderByIdDesc();

        if (latestBuild == null) {

            throw new RuntimeException(
                    "Build not found");
        }

        OllamaIssueEntity issue =
                ollamaIssueRepository
                        .findByIssueKeyAndBuildId(
                                issueKey,
                                latestBuild.getId())
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Issue not found"));

        return OllamaIssueResponse
                .builder()
                .issueKey(
                        issue.getIssueKey())
                .rule(
                        issue.getRuleKey())
                .severity(
                        issue.getSeverity())
                .type(
                        issue.getIssueType())
                .file(
                        issue.getFilePath())
                .line(
                        issue.getLineNumber())
                .rootCause(
                        issue.getRootCause())
                .exactFix(
                        issue.getExactFix())
                .suggestedCode(
                        issue.getSuggestedCode())
                .estimatedImpact(
                        issue.getEstimatedImpact())
                .build();
    }
   }