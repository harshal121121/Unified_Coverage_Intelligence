interface Props {
  color: string;
}

export default function HeatmapBadge({ color }: Props) {
  const hexColor =
    color === "GREEN"
      ? "var(--google-green-600)"
      : color === "YELLOW"
      ? "var(--google-yellow-600)"
      : "var(--google-red-600)";

  return (
    <div
      className="dot-indicator"
      style={{
        color: hexColor,
        backgroundColor: hexColor,
      }}
      title={`Heatmap Status: ${color}`}
    />
  );
}