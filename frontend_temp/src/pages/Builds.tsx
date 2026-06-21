import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { getBuildHistory } from "../api/dashboardApi";
import StatusBadge from "../components/common/StatusBadge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  GitBranch,
  Calendar,
  Timer,
  Activity,
  BarChart3,
  Package,
  Filter,
  Hash,
  Search,
  TrendingUp,
  TrendingDown,
  Shield,
  ArrowLeft,
  Layers,
  ChevronDown,
} from "lucide-react";

export default function Builds() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [selectedBuildId, setSelectedBuildId] = useState<number | null>(null);
  const [showBuildDetail, setShowBuildDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [buildSearch, setBuildSearch] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  useEffect(() => {
    getBuildHistory()
      .then((res) => setBuilds(Array.isArray(res.data) ? [...res.data].reverse() : []))
      .catch(console.error);
  }, []);

  // Computed stats
  const passedBuilds = builds.filter(
    (b) => b.status === "SUCCESS" || b.status === "PASSED"
  ).length;
  const failedBuilds = builds.length - passedBuilds;

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.round(ms / 1000);
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredBuilds = builds.filter((build) => {
    if (build.buildId == null) return false;
    const isSuccess = build.status === "SUCCESS" || build.status === "PASSED";
    const statusCategory = isSuccess ? "SUCCESS" : "FAILED";
    const statusMatch = statusFilter === "ALL" || statusCategory === statusFilter;
    const searchMatch =
      !buildSearch || build.buildId.toString().includes(buildSearch.trim());
    return statusMatch && searchMatch;
  });

  const successRate =
    builds.length > 0
      ? ((passedBuilds / builds.length) * 100).toFixed(1)
      : "0";

  const getStatusIcon = (status: string, size = 18) => {
    if (status === "SUCCESS" || status === "PASSED") {
      return (
        <CheckCircle2
          size={size}
          style={{ color: "var(--google-green-600)", flexShrink: 0 }}
        />
      );
    }
    return (
      <XCircle
        size={size}
        style={{ color: "var(--google-red-600)", flexShrink: 0 }}
      />
    );
  };

  const getStatusBarColor = (status: string) => {
    if (status === "SUCCESS" || status === "PASSED")
      return "var(--google-green-600)";
    return "var(--google-red-600)";
  };

  const getCoverageColor = (cov: number) => {
    if (cov >= 80) return "var(--google-green-600)";
    if (cov >= 50) return "var(--google-yellow-600)";
    return "var(--google-red-600)";
  };

  const handleSelectBuild = (buildId: number) => {
    setSelectedBuildId(buildId);
    setShowBuildDetail(true);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToBuilds = () => {
    setSelectedBuildId(null);
    setShowBuildDetail(false);
  };

  const selectedBuild = builds.find((b) => b.buildId === selectedBuildId);

  const durationMs = selectedBuild ? (selectedBuild.buildDuration ?? selectedBuild.duration ?? selectedBuild.executionTime ?? selectedBuild.execution_time ?? selectedBuild.durationMs ?? selectedBuild.duration_ms ?? selectedBuild.timeTaken ?? selectedBuild.time_taken) : null;
  const qgStatusRaw = selectedBuild ? (selectedBuild.qualityGateStatus ?? selectedBuild.quality_gate_status ?? selectedBuild.qualityGate ?? selectedBuild.quality_gate ?? selectedBuild.sonarQualityGate ?? selectedBuild.sonar_quality_gate ?? selectedBuild.gateStatus) : null;
  const qgStatus = typeof qgStatusRaw === 'object' && qgStatusRaw !== null ? qgStatusRaw.status : qgStatusRaw;

  const getSelectedBuildDelta = () => {
    if (!selectedBuild) return null;
    const idx = builds.findIndex((b) => b.buildId === selectedBuild.buildId);
    // builds is descending (newest first). The previous build is at idx + 1.
    if (idx < 0 || idx >= builds.length - 1) return null;
    const prevBuild = builds[idx + 1];
    const delta = (selectedBuild.coverage ?? 0) - (prevBuild.coverage ?? 0);
    return {
      delta: parseFloat(delta.toFixed(2)),
      prevBuildId: prevBuild.buildId,
      prevCoverage: prevBuild.coverage ?? 0,
    };
  };
  const buildDelta = getSelectedBuildDelta();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('#custom-build-selector')) {
        setIsSearchDropdownOpen(false);
      }
    };
    if (isSearchDropdownOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSearchDropdownOpen]);

  return (
    <MainLayout>
      <div className="page-subtitle">Repository Operations</div>
      <h1 className="page-title">Build Pipeline</h1>
      <p
        style={{
          color: "var(--text-secondary)",
          marginBottom: "24px",
          marginTop: "-16px",
          fontSize: "14px",
        }}
      >
        CI/CD pipeline history, build analytics, and deployment metrics.
      </p>

      {/* KPI Cards */}
      <div className="grid-cols-4" style={{ marginBottom: "24px" }}>
        {/* Total Builds */}
        <div
          className="g-card"
          style={{ padding: "20px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "var(--google-blue-600)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <Package size={16} style={{ color: "var(--text-secondary)" }} />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Total Builds
            </span>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            {builds.length}
          </span>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            All recorded pipeline runs
          </p>
        </div>

        {/* Passed Builds */}
        <div
          className="g-card"
          style={{ padding: "20px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "var(--google-green-600)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <CheckCircle2
              size={16}
              style={{ color: "var(--google-green-600)" }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Passed Builds
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--google-green-600)",
                fontFamily: "var(--font-display)",
              }}
            >
              {passedBuilds}
            </span>
            <span
              className="g-badge g-badge-green"
              style={{ fontSize: "11px", fontWeight: 600 }}
            >
              {successRate}%
            </span>
          </div>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            Success rate across all runs
          </p>
        </div>

        {/* Failed Builds */}
        <div
          className="g-card"
          style={{ padding: "20px", position: "relative", overflow: "hidden" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                failedBuilds > 0
                  ? "var(--google-red-600)"
                  : "var(--google-green-600)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <XCircle
              size={16}
              style={{
                color:
                  failedBuilds > 0
                    ? "var(--google-red-600)"
                    : "var(--google-green-600)",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Failed Builds
            </span>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color:
                failedBuilds > 0
                  ? "var(--google-red-600)"
                  : "var(--google-green-600)",
              fontFamily: "var(--font-display)",
            }}
          >
            {failedBuilds}
          </span>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            {failedBuilds === 0
              ? "No failures detected"
              : "Builds requiring attention"}
          </p>
        </div>
      </div>

      {/* ── Build Detail View OR Filter + Table ── */}
      {showBuildDetail && selectedBuild ? (
        /* ══════════════════════════════════════
           FULL BUILD DETAIL VIEW
           ══════════════════════════════════════ */
        <div style={{ animation: "fadeIn 0.35s ease-out forwards" }}>
          {/* Back button */}
          <button
            id="back-to-builds-btn"
            onClick={handleBackToBuilds}
            className="g-btn g-btn-outline"
            style={{
              marginBottom: "20px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 600,
              padding: "9px 18px",
              fontSize: "13.5px",
            }}
          >
            <ArrowLeft size={15} />
            Back to all builds
          </button>

          {/* Detail header card */}
          <div
            className="g-card"
            style={{
              padding: "28px 32px",
              marginBottom: "20px",
              borderTop: `4px solid ${getStatusBarColor(selectedBuild.status)}`,
              animation: "fadeIn 0.3s ease-out forwards",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "10px",
                  }}
                >
                  Selected Build Details
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    {getStatusIcon(selectedBuild.status, 30)}
                    <span
                      style={{
                        fontSize: "42px",
                        fontWeight: 800,
                        fontFamily: "var(--font-display)",
                        color: "var(--text-primary)",
                        lineHeight: 1,
                      }}
                    >
                      #{selectedBuild.buildId}
                    </span>
                  </div>
                  <StatusBadge status={selectedBuild.status} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "var(--text-secondary)",
                    fontSize: "13.5px",
                  }}
                >
                  <GitBranch
                    size={14}
                    style={{ color: "var(--bmc-orange)" }}
                  />
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                    }}
                  >
                    {selectedBuild.branch ?? "main"}
                  </span>
                  <span style={{ opacity: 0.3 }}>•</span>
                  <span>{selectedBuild.repositoryName ?? "repository"}</span>
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    justifyContent: "flex-end",
                    marginBottom: "6px",
                  }}
                >
                  <Calendar
                    size={13}
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Executed
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {selectedBuild.buildTime
                    ? new Date(selectedBuild.buildTime).toLocaleString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "—"}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginTop: "4px",
                  }}
                >
                  {selectedBuild.buildTime
                    ? formatRelativeTime(selectedBuild.buildTime)
                    : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Large metric cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            {/* Coverage */}
            <div
              className="g-card build-detail-metric-card"
              style={{
                padding: "20px",
                borderTop: `3px solid ${getCoverageColor(
                  selectedBuild.coverage ?? 0
                )}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >
                <div
                  className="metric-icon-box"
                  style={{
                    background: `${getCoverageColor(
                      selectedBuild.coverage ?? 0
                    )}1a`,
                  }}
                >
                  <BarChart3
                    size={17}
                    style={{
                      color: getCoverageColor(selectedBuild.coverage ?? 0),
                    }}
                  />
                </div>
                <span className="metric-card-label">Coverage</span>
              </div>
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: 800,
                  color: getCoverageColor(selectedBuild.coverage ?? 0),
                  fontFamily: "var(--font-display)",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}
              >
                {selectedBuild.coverage ?? 0}%
              </div>
              <div
                style={{
                  height: "8px",
                  background: "var(--grey-200)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: `${selectedBuild.coverage ?? 0}%`,
                    height: "100%",
                    background: getCoverageColor(selectedBuild.coverage ?? 0),
                    borderRadius: "4px",
                    transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </div>
              <div
                style={{ fontSize: "11px", color: "var(--text-secondary)" }}
              >
                coverage percentage
              </div>
            </div>

            {/* Coverage Delta */}
            <div
              className="g-card build-detail-metric-card"
              style={{
                padding: "20px",
                borderTop: `3px solid ${
                  buildDelta && buildDelta.delta >= 0
                    ? "var(--google-green-600)"
                    : "var(--google-red-600)"
                }`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >
                <div
                  className="metric-icon-box"
                  style={{
                    background:
                      buildDelta && buildDelta.delta >= 0
                        ? "var(--google-green-50)"
                        : "var(--google-red-50)",
                  }}
                >
                  {buildDelta && buildDelta.delta >= 0 ? (
                    <TrendingUp
                      size={17}
                      style={{ color: "var(--google-green-600)" }}
                    />
                  ) : (
                    <TrendingDown
                      size={17}
                      style={{ color: "var(--google-red-600)" }}
                    />
                  )}
                </div>
                <span className="metric-card-label">Coverage Delta</span>
              </div>
              {buildDelta ? (
                <>
                  <div
                    style={{
                      fontSize: "42px",
                      fontWeight: 800,
                      color:
                        buildDelta.delta >= 0
                          ? "var(--google-green-600)"
                          : "var(--google-red-600)",
                      fontFamily: "var(--font-display)",
                      lineHeight: 1,
                      marginBottom: "10px",
                    }}
                  >
                    {buildDelta.delta >= 0 ? "+" : ""}
                    {buildDelta.delta}%
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    vs Build #{buildDelta.prevBuildId} (
                    {buildDelta.prevCoverage}%)
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      marginBottom: "10px",
                      marginTop: "10px",
                    }}
                  >
                    —
                  </div>
                  <div
                    style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                  >
                    No previous build to compare
                  </div>
                </>
              )}
            </div>

            {/* Build Status */}
            <div
              className="g-card build-detail-metric-card"
              style={{
                padding: "20px",
                borderTop: `3px solid ${getStatusBarColor(
                  selectedBuild.status
                )}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >
                <div
                  className="metric-icon-box"
                  style={{
                    background:
                      selectedBuild.status === "SUCCESS" ||
                      selectedBuild.status === "PASSED"
                        ? "var(--google-green-50)"
                        : "var(--google-red-50)",
                  }}
                >
                  {getStatusIcon(selectedBuild.status, 17)}
                </div>
                <span className="metric-card-label">Build Status</span>
              </div>
              <div
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  color: getStatusBarColor(selectedBuild.status),
                  fontFamily: "var(--font-display)",
                  lineHeight: 1,
                  marginBottom: "14px",
                }}
              >
                {selectedBuild.status}
              </div>
              <StatusBadge status={selectedBuild.status} />
            </div>

            {/* Branch */}
            <div
              className="g-card build-detail-metric-card"
              style={{
                padding: "20px",
                borderTop: "3px solid var(--bmc-orange)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >
                <div
                  className="metric-icon-box"
                  style={{ background: "var(--bmc-orange-light)" }}
                >
                  <GitBranch
                    size={17}
                    style={{ color: "var(--bmc-orange)" }}
                  />
                </div>
                <span className="metric-card-label">Branch</span>
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1.3,
                  marginBottom: "10px",
                  wordBreak: "break-all",
                }}
              >
                {selectedBuild.branch ?? "main"}
              </div>
              <div
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                {selectedBuild.repositoryName ?? "repository"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════
           FILTER BAR + BUILD HISTORY TABLE
           ══════════════════════════════════════ */
        <>
          {/* Filter Bar */}
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              background: "var(--bg-card)",
              padding: "12px 20px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
              flexWrap: "wrap",
            }}
          >
            {/* Direct Build Selector */}
            <div
              id="custom-build-selector"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "none",
                width: "200px",
                background: "var(--grey-50)",
                borderRadius: "6px",
                padding: "7px 12px",
                border: "1px solid var(--border-color)",
                position: "relative",
                cursor: "pointer",
                userSelect: "none"
              }}
              onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
            >
              <Search
                size={14}
                style={{ color: "var(--text-secondary)", flexShrink: 0 }}
              />
              <div
                style={{
                  flex: 1,
                  fontSize: "13.5px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Search build ID...</span>
                <ChevronDown size={14} style={{ flexShrink: 0, transition: "transform 0.2s", transform: isSearchDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </div>
              
              {isSearchDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    width: "100%",
                    maxHeight: "350px",
                    overflowY: "auto",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    animation: "slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    display: "flex",
                    flexDirection: "column",
                    padding: "6px"
                  }}
                >
                  <style>{`
                    @keyframes slideDown {
                      from { opacity: 0; transform: translateY(-8px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    .custom-dropdown-item {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 10px 14px;
                      border-bottom: 1px solid var(--border-color);
                      transition: all 0.2s;
                    }
                    .custom-dropdown-item:last-child {
                      border-bottom: none;
                    }
                    .custom-dropdown-item:hover {
                      background: var(--grey-50);
                    }
                  `}</style>
                  {builds.length === 0 && (
                    <div style={{ padding: "12px", textAlign: "center", color: "var(--text-secondary)", fontSize: "12.5px" }}>
                      No builds available
                    </div>
                  )}
                  {builds.map(b => {
                    const isSuccess = b.status === "SUCCESS" || b.status === "PASSED";
                    return (
                      <div
                        key={b.buildId}
                        className="custom-dropdown-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSearchDropdownOpen(false);
                          handleSelectBuild(b.buildId);
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                            {b.buildId}
                          </span>
                          <span style={{ 
                            fontSize: "11px", 
                            fontWeight: 700, 
                            padding: "2px 8px", 
                            borderRadius: "12px", 
                            background: isSuccess ? "var(--google-green-50)" : "var(--google-red-50)",
                            color: isSuccess ? "var(--google-green-600)" : "var(--google-red-600)",
                            textTransform: "uppercase"
                          }}>
                            {isSuccess ? "SUCCESS" : "FAILED"}
                          </span>
                        </div>
                        {b.branch && (
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                            <GitBranch size={12} /> {b.branch}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              style={{
                width: "1px",
                height: "24px",
                background: "var(--border-color)",
                flexShrink: 0,
              }}
            />

            {/* Status filter */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Filter
                size={14}
                style={{ color: "var(--text-secondary)", flexShrink: 0 }}
              />
              <select
                id="build-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="g-select"
                style={{ padding: "6px 12px", minWidth: "130px", fontSize: "13px" }}
              >
                <option value="ALL">All Status</option>
                <option value="SUCCESS">Success</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexShrink: 0,
              }}
            >
              <Hash size={12} />
              <span>
                {filteredBuilds.length} of {builds.length} builds
              </span>
              <span
                style={{
                  color: "var(--google-blue-600)",
                  fontWeight: 600,
                }}
              >
                — click a row to inspect
              </span>
            </div>
          </div>

          {/* Build History Table */}
          <div className="g-card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                borderBottom: "1px solid var(--border-color)",
                background: "var(--grey-50)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Layers
                  size={15}
                  style={{ color: "var(--text-secondary)" }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  Build History
                </span>
              </div>
              <span
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                {filteredBuilds.length} build
                {filteredBuilds.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredBuilds.length > 0 ? (
              <div
                className="g-table-container"
                style={{ maxHeight: "520px", overflowY: "auto" }}
              >
                <table className="g-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "36px" }}></th>
                      <th>Build</th>
                      <th>Status</th>
                      <th>Repository</th>
                      <th>Branch</th>
                      <th>Coverage</th>
                      <th style={{ textAlign: "right" }}>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBuilds.map((build) => {
                      const coverageVal = build.coverage ?? 0;
                      return (
                        <tr
                          key={build.buildId}
                          className="clickable-row"
                          onClick={() => handleSelectBuild(build.buildId)}
                        >
                          {/* Status bar */}
                          <td style={{ padding: "0 0 0 4px" }}>
                            <div
                              style={{
                                width: "4px",
                                height: "32px",
                                borderRadius: "2px",
                                background: getStatusBarColor(build.status),
                                margin: "0 auto",
                              }}
                            />
                          </td>

                          {/* Build ID */}
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              {getStatusIcon(build.status, 14)}
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 700,
                                  fontFamily: "var(--font-display)",
                                  color: "var(--text-primary)",
                                }}
                              >
                                #{build.buildId}
                              </span>
                            </div>
                          </td>

                          {/* Status badge */}
                          <td>
                            <StatusBadge status={build.status} />
                          </td>

                          {/* Repo */}
                          <td>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--text-secondary)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "block",
                                maxWidth: "160px",
                              }}
                            >
                              {build.repositoryName ?? "repository"}
                            </span>
                          </td>

                          {/* Branch */}
                          <td>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                color: "var(--text-secondary)",
                              }}
                            >
                              <GitBranch size={11} />
                              {build.branch ?? "main"}
                            </span>
                          </td>

                          {/* Coverage */}
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <div
                                style={{
                                  width: "56px",
                                  height: "4px",
                                  background: "var(--grey-200)",
                                  borderRadius: "2px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${coverageVal}%`,
                                    height: "100%",
                                    background: getCoverageColor(coverageVal),
                                    borderRadius: "2px",
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: getCoverageColor(coverageVal),
                                }}
                              >
                                {coverageVal}%
                              </span>
                            </div>
                          </td>

                          {/* Relative time */}
                          <td style={{ textAlign: "right" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "12px",
                                color: "var(--text-secondary)",
                              }}
                            >
                              <Clock size={11} />
                              {build.buildTime
                                ? formatRelativeTime(build.buildTime)
                                : "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 40px",
                  color: "var(--text-secondary)",
                }}
              >
                <Activity
                  size={40}
                  style={{
                    color: "var(--grey-300)",
                    margin: "0 auto 12px",
                    display: "block",
                  }}
                />
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "6px",
                  }}
                >
                  No Builds Found
                </h3>
                <p style={{ fontSize: "13px" }}>
                  No builds match your current filter criteria.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
}