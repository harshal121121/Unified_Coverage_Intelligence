package com.bmc.coverage_dashboard.service.impl;

import com.bmc.coverage_dashboard.dto.Upload.BuildDto;
import com.bmc.coverage_dashboard.dto.Upload.OllamaAnalysisUploadDto;
import com.bmc.coverage_dashboard.dto.Upload.SonarSummaryDto;
import com.bmc.coverage_dashboard.dto.Upload.UnifiedCoverageReportDto;
import com.bmc.coverage_dashboard.entity.*;
import com.bmc.coverage_dashboard.repository.*;
import com.bmc.coverage_dashboard.service.BuildUploadService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BuildUploadServiceImpl implements BuildUploadService {

    private final RepositoryRepository repositoryRepository;

    private final BuildRepository buildRepository;

    private final CoverageSummaryRepository coverageSummaryRepository;

    private final ModuleCoverageRepository moduleCoverageRepository;

    private final SonarMetricsRepository sonarMetricsRepository;

    private final QualityGateConditionRepository
            qualityGateConditionRepository;

    private final ObjectMapper objectMapper;

    private final RawReportRepository rawReportRepository;

    private final SonarIssueRepository sonarIssueRepository;

    private final OllamaIssueRepository
            ollamaIssueRepository;



    @Override
    public void processCoverageReport(
            UnifiedCoverageReportDto report) {

        /*
         * Save Repository
         */
        RepositoryEntity repository =
                repositoryRepository
                        .findByUrlAndBranch(
                                report.getProject().getRepository(),
                                report.getProject().getBranch())
                        .orElseGet(() ->
                                repositoryRepository.save(
                                        RepositoryEntity.builder()
                                                .name(
                                                        report.getProject().getName())
                                                .url(
                                                        report.getProject().getRepository())
                                                .branch(
                                                        report.getProject().getBranch())
                                                .createdAt(
                                                        LocalDateTime.now())
                                                .build()));

        repository =
                repositoryRepository.save(repository);

        /*
         * Save Build
         */
        BuildDto buildDto = report.getBuild();

        BuildEntity build = BuildEntity.builder()
                .repository(repository)
                .createdAt(LocalDateTime.now())
                .build();

        if (buildDto != null) {

            build.setBuildNumber(buildDto.getBuildNumber());
            build.setStatus(buildDto.getStatus());
            build.setCommitId(buildDto.getCommitId());
            build.setCommitMessage(buildDto.getCommitMessage());
            build.setAuthor(buildDto.getAuthor());
            build.setTriggeredBy(buildDto.getTriggeredBy());
            build.setDurationSeconds(buildDto.getDurationSeconds());

            if (buildDto.getStartTime() != null) {
                build.setStartTime(
                        LocalDateTime.parse(
                                buildDto.getStartTime()));
            }

            if (buildDto.getEndTime() != null) {
                build.setEndTime(
                        LocalDateTime.parse(
                                buildDto.getEndTime()));
            }
        }

        build = buildRepository.save(build);

        BuildEntity savedBuild = build;

        /*
         * Save Coverage Summary
         */
        CoverageSummaryEntity summary =
                CoverageSummaryEntity.builder()
                        .overallLineCoverage(
                                report.getSummary().getOverallLineCoverage())
                        .overallBranchCoverage(
                                report.getSummary().getOverallBranchCoverage())
                        .javaCoverage(
                                report.getSummary().getJavaCoverage())
                        .cppCoverage(
                                report.getSummary().getCppCoverage())
                        .totalFiles(
                                report.getSummary().getTotalFiles())
                        .coveredFiles(
                                report.getSummary().getCoveredFiles())
                        .partiallyCoveredFiles(
                                report.getSummary().getPartiallyCoveredFiles())
                        .uncoveredFiles(
                                report.getSummary().getUncoveredFiles())
                        .totalTests(
                                report.getSummary().getTotalTests())
                        .passedTests(
                                report.getSummary().getPassedTests())
                        .failedTests(
                                report.getSummary().getFailedTests())
                        .qualityGate(
                                report.getSummary().getQualityGate())
                        .build(build)
                        .build();

        coverageSummaryRepository.save(summary);

        /*
         * Save Modules
         */
        if (report.getModules() != null) {

            report.getModules().forEach(module -> {

                ModuleCoverageEntity moduleEntity =
                        ModuleCoverageEntity.builder()
                                .moduleName(module.getName())
                                .modulePath(module.getPath())
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
                                .build(savedBuild)
                                .build();

                moduleCoverageRepository.save(moduleEntity);

            });
        }

        if (report.getSonar() != null
                && report.getSonar().getSummary() != null) {

            SonarSummaryDto summaryDto =
                    report.getSonar().getSummary();

            SonarMetricsEntity sonar =
                    SonarMetricsEntity.builder()
                            .bugs(summaryDto.getBugs())
                            .vulnerabilities(
                                    summaryDto.getVulnerabilities())
                            .codeSmells(
                                    summaryDto.getCodeSmells())
                            .securityHotspots(
                                    summaryDto.getSecurityHotspots())
                            .securityRating(
                                    summaryDto.getSecurityRating())
                            .reliabilityRating(
                                    summaryDto.getReliabilityRating())
                            .maintainabilityRating(
                                    summaryDto.getMaintainabilityRating())
                            .technicalDebtMinutes(
                                    summaryDto.getTechnicalDebtMinutes())
                            .duplicatedLines(
                                    summaryDto.getDuplicatedLines())
                            .duplicatedBlocks(
                                    summaryDto.getDuplicatedBlocks())
                            .duplicatedLinesDensity(
                                    summaryDto.getDuplicatedLinesDensity())
                            .criticalIssues(
                                    Double.valueOf(summaryDto.getCriticalIssues()))
                            .majorIssues(
                                    Double.valueOf(summaryDto.getMajorIssues()))
                            .minorIssues(
                                    Double.valueOf(summaryDto.getMinorIssues()))
                            .build(savedBuild)
                            .build();

            sonarMetricsRepository.save(sonar);
        }

        if (report.getQualityGateConditions() != null) {
            report.getQualityGateConditions()
                    .forEach(condition -> {

                        QualityGateConditionEntity entity =
                                QualityGateConditionEntity.builder()
                                        .metric(condition.getMetric())
                                        .operator(condition.getOperator())
                                        .threshold(condition.getThreshold())
                                        .actualValue(condition.getActualValue())
                                        .status(condition.getStatus())
                                        .build(savedBuild)
                                        .build();

                        qualityGateConditionRepository.save(entity);
                    });
        }
        if (report.getSonar() != null
                && report.getSonar().getIssues() != null) {


            report.getSonar()
                    .getIssues()
                    .forEach(issue -> {

                        SonarIssueEntity entity =
                                SonarIssueEntity.builder()
                                        .issueKey(
                                                issue.getIssueKey())
                                        .type(
                                                issue.getType())
                                        .severity(
                                                issue.getSeverity())
                                        .ruleName(
                                                issue.getRule())
                                        .filePath(
                                                issue.getFile())
                                        .lineNumber(
                                                issue.getLine())
                                        .message(
                                                issue.getMessage())
                                        .status(
                                                issue.getStatus())
                                        .effortMinutes(
                                                issue.getEffortMinutes())
                                        .softwareQuality(
                                                issue.getSoftwareQuality())
                                        .tags(
                                                String.join(",",
                                                        issue.getTags()))
                                        .ruleDescription(
                                                issue.getRuleDescription())
                                        .recommendation(
                                                issue.getRecommendation())
                                        .impact(
                                                issue.getImpact())
                                        .build(savedBuild)
                                        .build();

                        sonarIssueRepository.save(entity);
                    });
        }


        try {

            String rawJson =
                    objectMapper.writeValueAsString(report);

            RawReportEntity rawReport =
                    RawReportEntity.builder()
                            .reportJson(rawJson)
                            .createdAt(
                                    LocalDateTime.now())
                            .build(build)
                            .build();

            rawReportRepository.save(rawReport);

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Failed to save raw report",
                    ex);
        }
        System.out.println(
                "Coverage report saved successfully.");
    }
    @Override
    @Transactional
    public void processOllamaAnalysis(
            OllamaAnalysisUploadDto dto) {

        ollamaIssueRepository.deleteAll();

        BuildEntity latestBuild =
                buildRepository
                        .findTopByOrderByIdDesc();

        if (latestBuild == null) {

            throw new RuntimeException(
                    "No build found");
        }

        dto.getIssues()
                .forEach(issue -> {

                    try {

                        String rootCauseJson =
                                objectMapper.writeValueAsString(
                                        issue.getRootCause());

                        String exactFixJson =
                                objectMapper.writeValueAsString(
                                        issue.getExactFix());

                        String suggestedCodeJson =
                                objectMapper.writeValueAsString(
                                        issue.getSuggestedCode());

                        String estimatedImpactJson =
                                objectMapper.writeValueAsString(
                                        issue.getEstimatedImpact());
                        OllamaIssueEntity entity =
                                OllamaIssueEntity
                                        .builder()
                                        .build(
                                                latestBuild)
                                        .issueKey(
                                                issue.getIssueKey())
                                        .ruleKey(
                                                issue.getRule())
                                        .issueType(
                                                issue.getType())
                                        .severity(
                                                issue.getSeverity())
                                        .filePath(
                                                issue.getFile())
                                        .lineNumber(
                                                issue.getLine())
                                        .rootCause(
                                                rootCauseJson)
                                        .exactFix(
                                                exactFixJson)
                                        .suggestedCode(
                                                suggestedCodeJson)
                                        .estimatedImpact(
                                                estimatedImpactJson)
                                        .build();

                        ollamaIssueRepository
                                .save(entity);

                    } catch (Exception e) {

                        throw new RuntimeException(
                                "Failed to save Ollama issue: "
                                        + issue.getIssueKey(),
                                e);
                    }
                });
    }
}