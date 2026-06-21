interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const isHealthy = status === "HEALTHY" || status === "SUCCESS" || status === "PASSED";
  const bg = isHealthy ? "var(--google-green-50)" : "var(--google-red-50)";
  const color = isHealthy ? "var(--google-green-600)" : "var(--google-red-600)";
  
  let displayText = status || "FAILED";
  if (!isHealthy && (status === "FAILURE" || !status)) {
    displayText = "FAILED";
  }

  return (
    <span style={{ 
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px", 
      fontWeight: 700, 
      padding: "3px 10px", 
      borderRadius: "12px", 
      background: bg,
      color: color,
      textTransform: "uppercase",
      letterSpacing: "0.03em"
    }}>
      {displayText}
    </span>
  );
}