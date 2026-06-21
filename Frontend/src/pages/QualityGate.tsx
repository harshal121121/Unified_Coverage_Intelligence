import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import RuleStatusBadge from "../components/common/RuleStatusBadge";

import QualityScoreTrendChart
from "../components/charts/QualityScoreTrendChart";

import {
  getQualityGate,
  getQualityGateHistory,
  getSonarSummary,
  getSummary,
} from "../api/dashboardApi";

export default function QualityGate() {
  const [gate, setGate] = useState<any>(null);

  const [history, setHistory] = useState<any[]>([]);
const [bugCount, setBugCount] = useState<number>(0);
const [vulnCount, setVulnCount] = useState<number>(0);
const [coverage, setCoverage] = useState<number | string>("-");

  const [search, setSearch] = useState("");

const [statusFilter, setStatusFilter] =
  useState("ALL");

  useEffect(() => {
  // Fetch Quality Gate data
  getQualityGate()
    .then((res) => {
      setGate(res.data);
    })
    .catch(console.error);

  // Fetch Quality Gate history
  getQualityGateHistory()
    .then((res) => {
      setHistory(Array.isArray(res.data) ? [...res.data].reverse() : []);
    })
    .catch(console.error);

  // Fetch Sonar issues and compute unique counts
  getSonarSummary()
    .then((res) => {
      setBugCount(res.data.bugs || 0);
      setVulnCount(res.data.vulnerabilities || 0);
    })
    .catch(console.error);

  getSummary()
    .then((res) => {
      setCoverage(res.data.overallCoverage || "-");
    })
    .catch(console.error);
}, []);

  if (!gate) {
    return (
      <MainLayout>
        Loading...
      </MainLayout>
    );
  }

  
  const filteredHistory = history.filter((item) => {
  const statusMatch =
    statusFilter === "ALL" ||
    item.status === statusFilter;

  const searchMatch =
    String(item.buildNumber)
      .toLowerCase()
      .includes(search.toLowerCase());

  return statusMatch && searchMatch;
});

console.log("Filter:", statusFilter);
console.log("Search:", search);
console.log("Filtered:", filteredHistory);
  return (
    <MainLayout>
      <div className="page-subtitle">Quality Analysis</div>
      <h1 className="page-title">Quality Gate</h1>

      {/* Main Status Panel */}
      <div
        className="g-card"
        style={{
          borderLeft: gate.status === "PASSED" ? "6px solid var(--google-green-600)" : "6px solid var(--google-red-600)",
          marginBottom: "24px",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Current Gate Status
            </span>
            <h2 style={{ fontSize: "28px", fontWeight: 600, color: gate.status === "PASSED" ? "var(--google-green-700)" : "var(--google-red-700)", marginTop: "4px" }}>
              {gate.status}
            </h2>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Quality Score</span>
            <h2 style={{ fontSize: "32px", fontWeight: 600, color: "var(--text-primary)" }}>
              {gate.score}%
            </h2>
          </div>
        </div>

        {/* Counter cards inside panel */}
        <div 
          style={{ 
            display: "flex", 
            gap: "24px", 
            marginTop: "20px", 
            borderTop: "1px solid var(--grey-100)", 
            paddingTop: "16px",
            fontSize: "13px",
            color: "var(--text-secondary)" 
          }}
        >
          <div>
            Bugs: <strong style={{ color: "var(--google-green-700)", fontSize: "15px" }}>{bugCount}</strong>
          </div>
          <div>
            Vulnerabilities: <strong style={{ color: "var(--google-red-700)", fontSize: "15px" }}>{vulnCount}</strong>
          </div>
          <div>
            Coverage: <strong style={{ color: "var(--google-blue-700)", fontSize: "15px" }}>{coverage !== "-" ? `${coverage}%` : "-"}</strong>
          </div>
        </div>
      </div>

      {/* Rule Evaluation Card */}
      <div className="g-card" style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "16px", marginBottom: "12px" }}>Rule Evaluation</h2>
        
        <div className="g-table-container" style={{ marginTop: 0 }}>
          <table className="g-table">
            <thead>
              <tr>
                <th>Rule Name</th>
                <th>Expected Threshold</th>
                <th>Actual Metric</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {gate.rules
                .filter((rule: any) => {
                  const name = (rule.name || "").toLowerCase();
                  return !name.includes("security") && !name.includes("maintainability");
                })
                .map((rule: any, index: number) => (
                <tr key={index}>
                  <td style={{ fontWeight: 500 }}>{rule.name}</td>
                  <td>{rule.expected}</td>
                  <td>{rule.actual}</td>
                  <td>
                    <RuleStatusBadge status={rule.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Gate History & Charts */}
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          alignItems: "start"
        }}
      >
        {/* Quality score Trend Card */}
        <div className="g-card" style={{ padding: "20px" }}>
          <QualityScoreTrendChart data={history} />
        </div>

        {/* Historical Runs log card */}
        <div className="g-card">
          <h2 style={{ fontSize: "16px", marginBottom: "16px" }}>Quality Gate History</h2>

          {/* Filters inside card */}
          <div className="flex-row-wrap" style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Search Build..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="g-input"
              style={{ flex: 1, padding: "8px 12px", minWidth: "120px" }}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="g-select"
              style={{ padding: "8px 12px", minWidth: "110px" }}
            >
              <option value="ALL">All Status</option>
              <option value="PASSED">Passed</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Historical Runs Log feed */}
          <div 
            style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "10px", 
              maxHeight: "350px", 
              overflowY: "auto",
              paddingRight: "4px"
            }}
          >
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
                <div
                  key={`${item.buildNumber}-${index}`}
                  style={{
                    border: "1px solid var(--grey-200)",
                    borderRadius: "6px",
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "var(--grey-20)"
                  }}
                >
                  <div>
                    <strong style={{ display: "block", fontSize: "14px", color: "var(--text-primary)" }}>
                      Build Number {item.buildNumber}
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                      Score: {item.score}% | Coverage: {item.coverage}%
                    </span>
                    <span style={{ display: "block", fontSize: "11px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      Bugs: {item.bugs} | Vuln: {item.vulnerabilities}
                    </span>
                  </div>

                  <span className={`g-badge ${item.status === "PASSED" ? "g-badge-green" : "g-badge-red"}`}>
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "var(--text-secondary)" }}>
                No records matched filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}