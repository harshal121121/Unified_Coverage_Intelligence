import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getModules, getModuleById } from "../api/dashboardApi";
import CoverageBar from "../components/common/CoverageBar";
import StatusBadge from "../components/common/StatusBadge";
import RiskBadge from "../components/common/RiskBadge";
import { 
  FileCode, 
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  Sparkles,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  Filter,
  X
} from "lucide-react";

// Priority: High (76–100%) → Medium (51–75%) → Low (26–50%) → Critical (0–25%)
const selectBestModule = (modules: any[]): any | null => {
  if (modules.length === 0) return null;
  const high = modules.find((m) => (m.lineCoverage ?? 0) > 75);
  if (high) return high;
  const medium = modules.find((m) => (m.lineCoverage ?? 0) > 50);
  if (medium) return medium;
  const low = modules.find((m) => (m.lineCoverage ?? 0) > 25);
  if (low) return low;
  return modules[0]; // fallback to Critical
};

// Coverage band definitions — ordered: High → Medium → Low → Critical
const COVERAGE_BANDS = [
  { key: "high", label: "High Coverage", range: "76–100%", min: 76, max: 100, color: "var(--google-green-600)", bgColor: "var(--google-green-50)", borderColor: "var(--google-green-100)" },
  { key: "medium", label: "Medium Coverage", range: "51–75%", min: 51, max: 75, color: "var(--google-blue-600)", bgColor: "var(--google-blue-50)", borderColor: "var(--google-blue-100)" },
  { key: "low", label: "Low Coverage", range: "26–50%", min: 26, max: 50, color: "var(--google-yellow-600)", bgColor: "var(--google-yellow-50)", borderColor: "var(--google-yellow-100)" },
  { key: "critical", label: "Critical Coverage", range: "0–25%", min: 0, max: 25, color: "var(--google-red-600)", bgColor: "var(--google-red-50)", borderColor: "var(--google-red-100)" },
];

const BAND_ICONS: Record<string, any> = {
  critical: AlertTriangle,
  low: TrendingDown,
  medium: BarChart3,
  high: CheckCircle2,
};

export default function Modules() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modules, setModules] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState(searchParams.get("lang") || "ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [expandedBands, setExpandedBands] = useState<{ [key: string]: boolean }>({
    critical: false,
    low: false,
    medium: false,
    high: false,
  });
  
  // Split pane selection states
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    getModules()
      .then((res) => {
        // Deduplicate modules by moduleName, keeping only unique files
        const seen = new Set<string>();
        const dataList = Array.isArray(res.data) ? [...res.data].reverse() : [];
        const uniqueModules = dataList.filter((mod: any) => {
          const key = mod.moduleName || "";
          
          // Filter out .cc, gmock, gtest, and test files as requested
          const lowerKey = key.toLowerCase();
          if (lowerKey.endsWith(".cc") || lowerKey.includes("gmock") || lowerKey.includes("gtest") || lowerKey.includes("test")) {
            return false;
          }

          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setModules(uniqueModules);
        if (uniqueModules.length > 0) {
          // Auto-select using priority: High → Medium → Low → Critical
          const best = selectBestModule(uniqueModules);
          setSelectedModuleId(best ? best.id : null);
        }
      })
      .catch(console.error);
  }, []);

  // Sync language filter from URL on mount and changes
  useEffect(() => {
    const langParam = searchParams.get("lang");
    if (langParam && langParam !== languageFilter) {
      setLanguageFilter(langParam);
    }
  }, [searchParams]);

  // Fetch full details of the selected module
  useEffect(() => {
    if (!selectedModuleId) return;
    setLoadingDetails(true);
    getModuleById(selectedModuleId)
      .then((res) => {
        setSelectedModule(res.data);
        setLoadingDetails(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingDetails(false);
      });
  }, [selectedModuleId]);

  // Language filter navigation — update URL when filter changes
  const handleLanguageChange = (value: string) => {
    setLanguageFilter(value);
    if (value === "ALL") {
      navigate("/modules", { replace: true });
    } else {
      navigate(`/modules?lang=${encodeURIComponent(value)}`, { replace: true });
    }

    // Auto-select the first module matching the new language filter
    const newFiltered = modules.filter((module) => {
      const searchMatch = module.moduleName.toLowerCase().includes(search.toLowerCase());
      const languageMatch = value === "ALL" || module.language === value;
      const riskMatch = riskFilter === "ALL" || module.riskLevel === riskFilter;
      return searchMatch && languageMatch && riskMatch;
    });
    
    if (newFiltered.length > 0) {
      // Auto-select using priority: High → Medium → Low → Critical
      const best = selectBestModule(newFiltered);
      setSelectedModuleId(best ? best.id : null);
    } else {
      setSelectedModuleId(null);
    }
  };

  const handleRiskChange = (value: string) => {
    setRiskFilter(value);

    // Auto-select the first module matching the new risk filter
    const newFiltered = modules.filter((module) => {
      const searchMatch = module.moduleName.toLowerCase().includes(search.toLowerCase());
      const languageMatch = languageFilter === "ALL" || module.language === languageFilter;
      const riskMatch = value === "ALL" || module.riskLevel === value;
      return searchMatch && languageMatch && riskMatch;
    });
    
    if (newFiltered.length > 0) {
      // Auto-select using priority: High → Medium → Low → Critical
      const best = selectBestModule(newFiltered);
      setSelectedModuleId(best ? best.id : null);
    } else {
      setSelectedModuleId(null);
    }
  };

  const toggleBand = (band: string) => {
    setExpandedBands((prev) => ({
      ...prev,
      [band]: !prev[band],
    }));
  };

  const filteredModules = modules.filter((module) => {
    const searchMatch = module.moduleName
      .toLowerCase()
      .includes(search.toLowerCase());

    const languageMatch =
      languageFilter === "ALL" || module.language === languageFilter;

    const riskMatch = riskFilter === "ALL" || module.riskLevel === riskFilter;

    return searchMatch && languageMatch && riskMatch;
  });

  // Group filtered modules by coverage band
  const groupedByBand: { [key: string]: any[] } = {
    critical: [],
    low: [],
    medium: [],
    high: [],
  };
  filteredModules.forEach((module) => {
    const cov = module.lineCoverage ?? 0;
    if (cov <= 25) groupedByBand.critical.push(module);
    else if (cov <= 50) groupedByBand.low.push(module);
    else if (cov <= 75) groupedByBand.medium.push(module);
    else groupedByBand.high.push(module);
  });

  // Hover path fetcher state
  const [hoveredModule, setHoveredModule] = useState<{ id: number, path: string }>({ id: 0, path: "" });
  const [hoverTimer, setHoverTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (module: any) => {
    // If it already has a path, use it directly
    if (module.modulePath) {
      setHoveredModule({ id: module.id, path: module.modulePath });
      return;
    }
    
    // Show a loading message and fetch the path
    setHoveredModule({ id: module.id, path: "Loading path..." });
    const timer = setTimeout(() => {
      getModuleById(module.id).then(res => {
        setHoveredModule({ id: module.id, path: res.data.modulePath || "Path not available" });
      }).catch(() => {
        setHoveredModule({ id: module.id, path: "Path not available" });
      });
    }, 150); // Small debounce
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    setHoveredModule({ id: 0, path: "" });
  };

  return (
    <MainLayout>
      <div className="page-subtitle">Codebase Analyzer</div>
      <h1 className="page-title">
        Modules Explorer
        {languageFilter !== "ALL" && (
          <span className="language-view-badge">
            <Filter size={12} />
            {languageFilter} View
            <span 
              style={{ cursor: "pointer", marginLeft: "4px", opacity: 0.6 }}
              onClick={() => handleLanguageChange("ALL")}
            >
              <X size={12} />
            </span>
          </span>
        )}
      </h1>

      {/* Filter and Search Bar */}
      <div 
        className="flex-row-wrap" 
        style={{ 
          marginBottom: "20px", 
          background: "var(--bg-card)", 
          padding: "14px 20px", 
          borderRadius: "10px", 
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)" }}>Language:</span>
          <select
            value={languageFilter}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="g-select"
            style={{ minWidth: "120px", padding: "8px 12px" }}
          >
            <option value="ALL">All</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)" }}>Risk Level:</span>
          <select
            value={riskFilter}
            onChange={(e) => handleRiskChange(e.target.value)}
            className="g-select"
            style={{ minWidth: "120px", padding: "8px 12px" }}
          >
            <option value="ALL">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search modules by file name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="g-input"
          style={{ flex: 1, minWidth: "220px", marginLeft: "auto" }}
        />
      </div>

      {/* Split Pane View */}
      <div 
        style={{ 
          display: "flex", 
          gap: "24px", 
          alignItems: "flex-start"
        }}
      >
        {/* LEFT COLUMN: Coverage-percentage-based categorization */}
        <div 
          style={{ 
            width: "380px", 
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0px"
          }}
        >
          {/* Summary stats */}
          <div 
            style={{ 
              display: "flex", 
              gap: "8px", 
              marginBottom: "12px",
              flexWrap: "wrap"
            }}
          >
            {COVERAGE_BANDS.map((band) => (
              <span 
                key={band.key}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "6px",
                  background: band.bgColor,
                  color: band.color,
                  border: `1px solid ${band.borderColor}`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                {band.label}: {groupedByBand[band.key].length}
              </span>
            ))}
          </div>

          {/* Section Title */}
          <div style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <BarChart3 size={14} style={{ color: "var(--bmc-orange)" }} />
            Coverage-Wise Module Classification
          </div>

          {/* Coverage band accordions */}
          {COVERAGE_BANDS.map((band) => {
            const bandModules = groupedByBand[band.key];
            const isExpanded = (search.trim() !== "" && bandModules.length > 0) || !!expandedBands[band.key];
            const BandIcon = BAND_ICONS[band.key];

            return (
              <div key={band.key} className="coverage-accordion">
                <div 
                  className="coverage-accordion-header"
                  onClick={() => toggleBand(band.key)}
                >
                  <div className="band-label">
                    {isExpanded ? <ChevronDown size={14} style={{ color: "var(--grey-500)" }} /> : <ChevronRight size={14} style={{ color: "var(--grey-500)" }} />}
                    <span className="band-dot" style={{ background: band.color }} />
                    <BandIcon size={14} style={{ color: band.color }} />
                    <span>{band.label}</span>
                    <span style={{ fontSize: "11px", fontWeight: 400, color: "var(--text-secondary)" }}>
                      ({band.range})
                    </span>
                  </div>
                  <span 
                    className="band-count"
                    style={{ 
                      background: band.bgColor, 
                      color: band.color,
                      border: `1px solid ${band.borderColor}`
                    }}
                  >
                    {bandModules.length}
                  </span>
                </div>

                {isExpanded && bandModules.length > 0 && (
                  <div className="coverage-accordion-body">
                    {bandModules.map((module) => {
                      const isSelected = module.id === selectedModuleId;
                      return (
                        <div
                          key={module.id}
                          className={`coverage-file-item ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedModuleId(module.id)}
                          onMouseEnter={() => handleMouseEnter(module)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <FileCode size={14} style={{ color: isSelected ? "var(--bmc-orange)" : "var(--google-blue-600)", flexShrink: 0 }} />
                          <span className="file-name">
                            {module.moduleName}
                          </span>
                          <span 
                            className="g-badge g-badge-grey"
                            style={{ fontSize: "10px", padding: "1px 5px", flexShrink: 0 }}
                          >
                            {module.language}
                          </span>
                          <span 
                            className={`g-badge ${module.lineCoverage >= 80 ? "g-badge-green" : module.lineCoverage >= 50 ? "g-badge-yellow" : "g-badge-red"}`}
                            style={{ fontSize: "10.5px", fontWeight: 700, padding: "1px 5px", flexShrink: 0 }}
                          >
                            {module.lineCoverage}%
                          </span>

                          {/* Tooltip showing full path on hover */}
                          <span className="file-tooltip">
                            {module.modulePath || (hoveredModule.id === module.id ? hoveredModule.path : "")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {isExpanded && bandModules.length === 0 && (
                  <div className="coverage-accordion-body" style={{ padding: "16px", textAlign: "center", color: "var(--text-secondary)", fontSize: "12px" }}>
                    No modules in this range
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Interactive coverage analysis breakdown */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
          {selectedModule ? (
            <div 
              className="g-card" 
              style={{ 
                animation: "fadeIn 0.3s ease-out forwards",
                padding: "20px 24px"
              }}
            >
              {/* Module Header Details */}
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start", 
                  borderBottom: "1px solid var(--border-color)", 
                  paddingBottom: "12px", 
                  marginBottom: "16px" 
                }}
              >
                <div>
                  <div className="page-subtitle" style={{ color: "var(--bmc-orange)" }}>Active Module Selection</div>
                  <div className="ui-tooltip-container">
                    <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "2px 0 6px 0", wordBreak: "break-all", fontFamily: "var(--font-display)", cursor: "pointer" }}>
                      {selectedModule.moduleName}
                    </h2>
                    <span className="ui-tooltip">
                      {selectedModule.modulePath || selectedModule.path || selectedModule.moduleName}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
                    <span className="g-badge g-badge-grey" style={{ fontSize: "11px" }}>{selectedModule.language}</span>
                    <RiskBadge risk={selectedModule.riskLevel} />
                    <StatusBadge status={selectedModule.status} />
                  </div>
                </div>

                {(() => {
                  const coverage = selectedModule.lineCoverage ?? 0;
                  const band = COVERAGE_BANDS.find(b => coverage >= b.min && coverage <= b.max) || COVERAGE_BANDS[3];
                  return (
                    <div 
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontWeight: 700,
                        backgroundColor: band.bgColor,
                        color: band.color,
                        border: `1px solid ${band.borderColor}`
                      }}
                    >
                      <span style={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.8 }}>Line Coverage</span>
                      <span style={{ fontSize: "24px", fontFamily: "var(--font-display)", fontWeight: 800 }}>
                        {selectedModule.lineCoverage}%
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Main Coverage Cards */}
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Metrics Breakdown
              </h3>
              
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "16px",
                  marginBottom: "16px"
                }}
              >
                <div style={{ border: "1px solid var(--border-color)", padding: "12px", borderRadius: "8px", background: "var(--grey-20)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Line Coverage Progress</span>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedModule.lineCoverage}%</strong>
                  </div>
                  <CoverageBar value={selectedModule.lineCoverage} />
                </div>

                <div style={{ border: "1px solid var(--border-color)", padding: "12px", borderRadius: "8px", background: "var(--grey-20)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Branch Coverage Progress</span>
                    <strong style={{ color: "var(--text-primary)" }}>{selectedModule.branchCoverage}%</strong>
                  </div>
                  <CoverageBar value={selectedModule.branchCoverage} />
                </div>
              </div>

              {/* Covered & Missed Details Grid */}
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Statement Counts
              </h3>

              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(4, 1fr)", 
                  gap: "12px",
                  marginBottom: "16px"
                }}
              >
                <div style={{ border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px", background: "var(--bg-card)", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Covered Lines</span>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--google-green-600)", margin: "4px 0 0" }}>
                    {selectedModule.coveredLines ?? "-"}
                  </p>
                </div>

                <div style={{ border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px", background: "var(--bg-card)", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Missed Lines</span>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--google-red-600)", margin: "4px 0 0" }}>
                    {selectedModule.missedLines ?? "-"}
                  </p>
                </div>

                <div style={{ border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px", background: "var(--bg-card)", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Covered Branches</span>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--google-green-600)", margin: "4px 0 0" }}>
                    {selectedModule.coveredBranches ?? "-"}
                  </p>
                </div>

                <div style={{ border: "1px solid var(--border-color)", padding: "10px", borderRadius: "8px", background: "var(--bg-card)", textAlign: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Missed Branches</span>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--google-red-600)", margin: "4px 0 0" }}>
                    {selectedModule.missedBranches ?? "-"}
                  </p>
                </div>
              </div>

              {/* Heatmap & Quality Assessment */}
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "16px"
                }}
              >
                <div className="g-card" style={{ padding: "12px", boxShadow: "none", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Heatmap Color status</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: selectedModule.heatmapColor === "GREEN" ? "var(--google-green-600)" : selectedModule.heatmapColor === "YELLOW" ? "var(--google-yellow-600)" : "var(--google-red-600)"
                    }} />
                    <span style={{ fontSize: "13.5px", fontWeight: 600 }}>{selectedModule.heatmapColor}</span>
                  </div>
                </div>

                <div className="g-card" style={{ padding: "12px", boxShadow: "none", border: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase" }}>Quality Assessment</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", color: selectedModule.status === "HEALTHY" ? "var(--google-green-600)" : "var(--google-red-600)" }}>
                    <Sparkles size={14} />
                    <span style={{ fontSize: "13.5px", fontWeight: 600 }}>
                      {selectedModule.status === "HEALTHY" ? "Verified Quality Passed" : "Needs Quality Remediation"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : loadingDetails ? (
            <div className="g-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
              <div style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
                Loading module details...
              </div>
            </div>
          ) : (
            <div className="g-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "400px", color: "var(--text-secondary)" }}>
              <FileSpreadsheet size={48} style={{ color: "var(--grey-300)", marginBottom: "12px" }} />
              <h3>Select a Module</h3>
              <p style={{ fontSize: "13px", marginTop: "4px" }}>
                Please select a module file from the coverage categories on the left to review its detailed coverage.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}