import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MetricCard from "../components/cards/MetricCard";
import CoverageTrendChart from "../components/charts/CoverageTrendChart";
import LanguageDistributionChart from "../components/charts/LanguageDistributionChart";

import {
  getSummary,
  getCoverageTrend,
  getLanguageDistribution,
  getLatestBuild,
  getSonarSummary,
} from "../api/dashboardApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);
  const [trend, setTrend] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any>(null);
  const [latestBuild, setLatestBuild] = useState<any>(null);
  const [sonar, setSonar] = useState<any>(null);

  useEffect(() => {
    getSummary().then((res) => setSummary(res.data));

    getCoverageTrend().then((res) => {
      const cleaned = res.data.filter((item: any) => item.buildId !== null);
      // Reverse so oldest build is first
      setTrend(cleaned.reverse());
    });

    getLanguageDistribution().then((res) => setLanguages(res.data));

    getLatestBuild().then((res) => setLatestBuild(res.data));

    getSonarSummary().then((res) => setSonar(res.data));
  }, []);

  return (
    <MainLayout>
      <div className="page-subtitle">Platform Metrics</div>
      <h1 className="page-title">Coverage at a glance</h1>

      {/* Primary Metrics Grid */}
      <div 
        style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px"
        }}
      >
        <MetricCard
          title="Overall Coverage"
          value={`${summary?.overallCoverage ?? "-"}%`}
          trend={summary?.overallCoverage ? `${(summary.overallCoverage - 80).toFixed(1)}%` : undefined}
          trendType={summary?.overallCoverage >= 80 ? "up" : "down"}
          subtitle="Aggregated code coverage"
          valueColor="var(--google-blue-600)"
        />

        <MetricCard
          title="Java Coverage"
          value={`${summary?.javaCoverage ?? "-"}%`}
          subtitle="JaCoCo coverage rating"
        />

        <MetricCard
          title="C++ Coverage"
          value={`${summary?.cppCoverage ?? "-"}%`}
          subtitle="GCOVR coverage rating"
        />

        <MetricCard
          title="Latest Build Status"
          value={latestBuild?.status ?? "-"}
          subtitle={`Build #${latestBuild?.buildId ?? "-"} by ${latestBuild?.author?.split(' ')[0] ?? "unknown"}`}
          trend={latestBuild?.status === "SUCCESS" ? "HEALTHY" : "CRITICAL"}
          trendType={latestBuild?.status === "SUCCESS" ? "up" : "down"}
          valueColor={latestBuild?.status === "SUCCESS" ? "var(--google-green-600)" : "var(--google-red-600)"}
        /> 
      </div>

      {/* Charts Grid */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          marginBottom: "32px"
        }}
      >
        <div className="g-card" style={{ padding: "20px" }}>
          <CoverageTrendChart data={trend} />
        </div>

        <div className="g-card" style={{ padding: "20px" }}>
          {languages ? (
            <LanguageDistributionChart
              javaCoverage={languages.javaCoverage}
              cppCoverage={languages.cppCoverage}
            />
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "350px", color: "var(--text-secondary)" }}>
              Loading Language data...
            </div>
          )}
        </div>
      </div>

      {/* Sonar Summary Section */}
      {sonar && (
        <div>
          <div className="page-subtitle" style={{ marginTop: "12px" }}>Code Quality Summary</div>
          <h2 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: 500 }}>Code Health</h2>
          
          <div 
            style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px"
            }}
          >
            <MetricCard
              title="Bugs"
              value={sonar.bugs ?? 0}
              subtitle="Click to view \& filter bugs"
              trend={(sonar.bugs ?? 0) > 0 ? `${sonar.bugs} issues` : "None"}
              trendType={(sonar.bugs ?? 0) > 0 ? "down" : "up"}
              valueColor="var(--google-red-600)"
              onClick={() => navigate("/code-health?filter=BUG")}
            />

            <MetricCard
              title="Vulnerabilities"
              value={sonar.vulnerabilities ?? 0}
              subtitle="Click to view vulnerabilities"
              trend={(sonar.vulnerabilities ?? 0) > 0 ? "HIGH RISK" : "SECURE"}
              trendType={(sonar.vulnerabilities ?? 0) > 0 ? "down" : "up"}
              valueColor="var(--google-red-700)"
              onClick={() => navigate("/code-health?filter=VULNERABILITY")}
            />

            <MetricCard
              title="Code Smells"
              value={sonar.codeSmells ?? 0}
              subtitle="Click to view code smells"
              valueColor="var(--google-blue-600)"
              onClick={() => navigate("/code-health?filter=CODE_SMELL")}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}