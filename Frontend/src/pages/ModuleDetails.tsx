import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { getModuleById } from "../api/dashboardApi";
import CoverageBar from "../components/common/CoverageBar";

export default function ModuleDetails() {
  const { id } = useParams();

  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    getModuleById(Number(id))
      .then((res) => setModule(res.data))
      .catch(console.error);
  }, [id]);

  if (!module) {
    return (
      <MainLayout>
        Loading...
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-subtitle">Module Analysis</div>
      <h1 className="page-title" style={{ wordBreak: "break-all" }}>{module.moduleName}</h1>

      {/* Attributes Row */}
      <div className="grid-cols-4" style={{ marginBottom: "24px" }}>
        <div className="g-card">
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Language</span>
          <h3 style={{ fontSize: "18px", marginTop: "4px" }}>{module.language}</h3>
        </div>

        <div className="g-card">
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Coverage Status</span>
          <div style={{ marginTop: "4px" }}>
            <span className={`g-badge ${module.status === "HEALTHY" ? "g-badge-green" : "g-badge-red"}`}>
              {module.status}
            </span>
          </div>
        </div>

        <div className="g-card">
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Risk Rating</span>
          <div style={{ marginTop: "4px" }}>
            <span className={`g-badge ${module.riskLevel === "LOW" ? "g-badge-green" : module.riskLevel === "MEDIUM" ? "g-badge-yellow" : "g-badge-red"}`}>
              {module.riskLevel} Risk
            </span>
          </div>
        </div>

        <div className="g-card">
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Heatmap Color</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: module.heatmapColor === "GREEN" ? "var(--google-green-600)" : module.heatmapColor === "YELLOW" ? "var(--google-yellow-600)" : "var(--google-red-600)"
            }} />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>{module.heatmapColor}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Comparison */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "24px"
        }}
      >
        {/* Coverage Percentage Card */}
        <div className="g-card">
          <h2 style={{ fontSize: "16px", marginBottom: "16px", borderBottom: "1px solid var(--grey-100)", paddingBottom: "10px" }}>Metrics Breakdown</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Line Coverage</span>
                <span style={{ fontWeight: 600 }}>{module.lineCoverage}%</span>
              </div>
              <CoverageBar value={module.lineCoverage} />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Branch Coverage</span>
                <span style={{ fontWeight: 600 }}>{module.branchCoverage}%</span>
              </div>
              <CoverageBar value={module.branchCoverage} />
            </div>
          </div>
        </div>

        {/* Coverage Count Details */}
        <div className="g-card">
          <h2 style={{ fontSize: "16px", marginBottom: "16px", borderBottom: "1px solid var(--grey-100)", paddingBottom: "10px" }}>Statement Count</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Covered Lines</span>
              <p style={{ fontSize: "20px", fontWeight: 600, color: "var(--google-green-700)", fontFamily: "var(--font-display)" }}>
                {module.coveredLines}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Missed Lines</span>
              <p style={{ fontSize: "20px", fontWeight: 600, color: "var(--google-red-700)", fontFamily: "var(--font-display)" }}>
                {module.missedLines}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Covered Branches</span>
              <p style={{ fontSize: "20px", fontWeight: 600, color: "var(--google-green-700)", fontFamily: "var(--font-display)" }}>
                {module.coveredBranches}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Missed Branches</span>
              <p style={{ fontSize: "20px", fontWeight: 600, color: "var(--google-red-700)", fontFamily: "var(--font-display)" }}>
                {module.missedBranches}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Path Viewer */}
      <div className="g-card">
        <h2 style={{ fontSize: "15px", marginBottom: "8px" }}>Module File Path</h2>
        <div 
          style={{ 
            background: "var(--grey-50)", 
            border: "1px solid var(--border-color)", 
            borderRadius: "4px", 
            padding: "12px 16px", 
            fontFamily: "var(--font-mono)", 
            fontSize: "13px", 
            color: "var(--grey-800)",
            wordBreak: "break-all"
          }}
        >
          {module.modulePath}
        </div>
      </div>
    </MainLayout>
  );
}