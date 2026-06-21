interface Props {
  risk: string;
}

export default function RiskBadge({ risk }: Props) {
  let badgeClass = "g-badge-grey";

  if (risk === "LOW") badgeClass = "g-badge-green";
  else if (risk === "MEDIUM") badgeClass = "g-badge-yellow";
  else if (risk === "HIGH") badgeClass = "g-badge-red";

  return (
    <span className={`g-badge ${badgeClass}`}>
      {risk}
    </span>
  );
}