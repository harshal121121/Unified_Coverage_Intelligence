interface Props {
  sourceData: any;
  onClose: () => void;
}

export default function SourceCodeModal({ sourceData, onClose }: Props) {
  if (!sourceData) return null;

  return (
    <div className="g-modal-backdrop" onClick={onClose}>
      <div 
        className="g-modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: "90%", 
          height: "85vh", 
          maxWidth: "1100px",
          background: "#0f172a",
          color: "#e2e8f0"
        }}
      >
        {/* Header */}
        <div className="g-modal-header" style={{ borderColor: "#1e293b" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#ffffff" }}>
            Source Code Viewer
          </h2>
          <button 
            onClick={onClose} 
            className="g-btn g-btn-outline" 
            style={{ 
              color: "#94a3b8", 
              borderColor: "#334155",
              padding: "6px 12px",
              fontSize: "13px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            Close Viewer
          </button>
        </div>

        {/* Info panel */}
        <div style={{ padding: "12px 24px", background: "#0b0f19", borderBottom: "1px solid #1e293b" }}>
          <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>Active File Path</span>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#38bdf8", marginTop: "2px", wordBreak: "break-all" }}>
            {sourceData.file}
          </p>
        </div>

        {/* Code Content Body */}
        <div className="g-modal-body" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div 
            className="code-viewer-container" 
            style={{ 
              flex: 1, 
              overflowY: "auto", 
              border: "none", 
              borderRadius: 0, 
              margin: 0 
            }}
          >
            {sourceData.source.map((lineObj: any) => {
              const isHighlighted = lineObj.line === sourceData.highlightLine;
              return (
                <div
                  key={lineObj.line}
                  className={`code-line ${isHighlighted ? "highlighted" : ""}`}
                >
                  <div className="code-line-number">
                    {lineObj.line}
                  </div>
                  <div className="code-line-content">
                    {lineObj.code}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}