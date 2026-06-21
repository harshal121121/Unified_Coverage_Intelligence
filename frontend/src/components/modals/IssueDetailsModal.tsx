interface Props {
  issue: any;
  onClose: () => void;
  onViewSource: (
    issueKey: string
  ) => void;
}

export default function IssueDetailsModal({
  issue,
  onClose,
  onViewSource,
}: Props) {
  if (!issue) return null;

  const isCritical = issue.severity === "CRITICAL" || issue.severity === "MAJOR";
  const bannerBg = isCritical ? "var(--google-red-50)" : "var(--google-blue-50)";
  const bannerBorder = isCritical ? "1px solid var(--google-red-100)" : "1px solid var(--google-blue-100)";
  const bannerText = isCritical ? "var(--google-red-700)" : "var(--google-blue-700)";

  return (
    <div className="g-modal-backdrop" onClick={onClose}>
      <div className="g-modal" onClick={(e) => e.stopPropagation()} style={{ width: "800px" }}>
        {/* Header */}
        <div className="g-modal-header">
          <h2 style={{ fontSize: "18px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Issue Details</span>
            <span style={{ fontSize: "13px", fontWeight: 400, color: "var(--text-secondary)" }}>
              ({issue.issueKey})
            </span>
          </h2>
          <button 
            onClick={onClose} 
            className="g-btn g-btn-outline" 
            style={{ padding: "4px 8px", border: "none", fontSize: "18px", color: "var(--grey-500)" }}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="g-modal-body">
          {/* Severity Banner */}
          <div
            style={{
              background: bannerBg,
              border: bannerBorder,
              color: bannerText,
              padding: "16px",
              borderRadius: "6px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.8 }}>
                {issue.type}
              </span>
              <h3 style={{ color: "inherit", margin: "2px 0 0", fontSize: "16px", fontWeight: 600 }}>
                {issue.message}
              </h3>
            </div>
            <span className={`g-badge ${isCritical ? "g-badge-red" : "g-badge-blue"}`} style={{ padding: "6px 12px", fontSize: "12px", border: "none" }}>
              {issue.severity}
            </span>
          </div>

          {/* Properties Grid */}
          <h3 style={{ fontSize: "14px", borderBottom: "1px solid var(--grey-200)", paddingBottom: "6px", marginBottom: "12px" }}>
            Properties
          </h3>
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "12px 24px",
              marginBottom: "24px",
              fontSize: "13.5px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>File:</span>
              <span style={{ fontWeight: 500, fontFamily: "var(--font-mono)", fontSize: "12.5px" }}>{issue.file}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Line:</span>
              <span style={{ fontWeight: 500 }}>{issue.line}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Rule ID:</span>
              <span style={{ fontWeight: 500, fontFamily: "var(--font-mono)", color: "var(--google-blue-600)" }}>{issue.rule}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Category:</span>
              <span style={{ fontWeight: 500 }}>{issue.softwareQuality ?? "Code Quality"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Status:</span>
              <span className={`g-badge ${issue.status === "OPEN" ? "g-badge-yellow" : "g-badge-green"}`} style={{ padding: "2px 8px", fontSize: "11px", fontWeight: 500 }}>
                {issue.status}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Fix Effort:</span>
              <span style={{ fontWeight: 500 }}>{issue.effortMinutes} minutes</span>
            </div>
          </div>

          {/* Rule Description & Recommended Fix */}
          {issue.ruleDescription && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", borderBottom: "1px solid var(--grey-200)", paddingBottom: "6px", marginBottom: "8px" }}>
                Rule Description
              </h3>
              <p style={{ fontSize: "13.5px", lineHeight: 1.6 }}>{issue.ruleDescription}</p>
            </div>
          )}

          {issue.recommendation && (
            <div 
              style={{ 
                marginBottom: "20px", 
                backgroundColor: "var(--google-green-50)", 
                border: "1px solid var(--google-green-100)", 
                padding: "16px",
                borderRadius: "6px"
              }}
            >
              <h3 style={{ fontSize: "14px", color: "var(--google-green-700)", marginBottom: "8px", fontWeight: 600 }}>
                💡 Recommended Fix
              </h3>
              <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "var(--google-green-700)" }}>
                {issue.recommendation}
              </p>
            </div>
          )}

          {/* Tags */}
          {issue.tags && (
            <div>
              <h3 style={{ fontSize: "14px", borderBottom: "1px solid var(--grey-200)", paddingBottom: "6px", marginBottom: "8px" }}>
                Metadata Tags
              </h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                {(Array.isArray(issue.tags) ? issue.tags : [issue.tags]).map((tag: string, index: number) => (
                  <span key={index} className="g-badge g-badge-grey" style={{ fontSize: "11px", fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="g-modal-footer">
          <button onClick={onClose} className="g-btn g-btn-outline">
            Close Panel
          </button>
          
          <button 
            onClick={() => {
              onViewSource(issue.issueKey);
            }} 
            className="g-btn g-btn-primary"
          >
            View Source Code
          </button>
        </div>
      </div>
    </div>
  );
}