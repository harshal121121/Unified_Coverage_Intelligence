interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  onClick?: () => void;
  valueColor?: string;
}

function MetricCard({ title, value, subtitle, trend, trendType, onClick, valueColor }: Props) {
  return (
    <div 
      className={`g-card ${onClick ? "interactive" : ""}`}
      onClick={onClick}
      style={{
        minWidth: "200px"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span 
          style={{ 
            fontSize: "12px", 
            fontWeight: 600, 
            color: "var(--text-secondary)", 
            textTransform: "uppercase", 
            letterSpacing: "0.05em" 
          }}
        >
          {title}
        </span>
        
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
          <span 
            style={{ 
              fontSize: "26px", 
              fontWeight: 600, 
              color: valueColor || "var(--text-primary)", 
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em"
            }}
          >
            {value}
          </span>
          
          {trend && (
            <span 
              className={`g-badge ${
                trendType === "up" 
                  ? "g-badge-green" 
                  : trendType === "down" 
                  ? "g-badge-red" 
                  : "g-badge-grey"
              }`}
              style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "4px", fontWeight: 500 }}
            >
              {trend}
            </span>
          )}
        </div>
        
        {subtitle && (
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export default MetricCard;