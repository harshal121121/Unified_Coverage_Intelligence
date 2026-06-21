import api from "./axios";
import type { RiskRatingResponse } from "../types/riskRating";

export const getSummary = () =>
  api.get("/api/dashboard/summary");

export const getModules = () =>
  api.get("/api/dashboard/modules");

export const getCoverageTrend = () =>
  api.get("/api/dashboard/coverage-trend");

export const getLanguageDistribution = () =>
  api.get("/api/dashboard/language-distribution");

export const getLatestBuild = () =>
  api.get("/api/dashboard/latest-build");

export const getBuildHistory = () =>
  api.get("/api/dashboard/build-history");

export const getSonarSummary = () =>
  api.get("/api/dashboard/sonar-summary");


export const getModuleById = (id: number) =>
  api.get(`/api/dashboard/modules/${id}`);

export const getQualityGate = () =>
  api.get("/api/dashboard/quality-gate");

export const getQualityGateHistory = () =>
  api.get("/api/dashboard/quality-gate-history");

export const getSonarIssueDetails = (
  issueKey: string
) =>
  api.get(
    `/api/dashboard/sonar-issues/${issueKey}`
  );

export const getSonarIssues = () =>
  api.get("/api/dashboard/sonar-issues");

export const getIssueSourceCode = (
  issueKey: string
) =>
  api.get(
    `/api/dashboard/sonar-issues/${issueKey}/source`
  );

export const getAiMetricsData = () =>
  api.get("/api/dashboard/ai-insights");

export const getComplexityAnalysis = () =>
  api.get("/api/complexity/results");

export const getRiskRating = () =>
  api.get<RiskRatingResponse>(
    "/api/dashboard/risk-rating"
  );

