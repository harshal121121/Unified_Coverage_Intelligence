interface Props {
  value: number;
}

export default function CoverageBar({ value }: Props) {
  const color =
    value >= 80
      ? "var(--google-green-600)"
      : value >= 50
      ? "var(--google-yellow-600)"
      : "var(--google-red-600)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
      <div
        style={{
          flex: 1,
          background: "var(--grey-200)",
          borderRadius: "4px",
          height: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            background: color,
            height: "100%",
            borderRadius: "4px",
            transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
      
      <span 
        style={{ 
          fontSize: "13px", 
          fontWeight: 600, 
          color: "var(--text-primary)", 
          minWidth: "40px", 
          textAlign: "right",
          fontFamily: "var(--font-body)"
        }}
      >
        {value}%
      </span>
    </div>
  );
}