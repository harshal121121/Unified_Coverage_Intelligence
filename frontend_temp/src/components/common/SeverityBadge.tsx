interface Props {
  severity: string;
}

export default function SeverityBadge({ severity }: Props) {
  let badgeClass = "g-badge-grey";

  switch (severity) {
    case "CRITICAL":
      badgeClass = "g-badge-red";
      break;
    case "MAJOR":
      badgeClass = "g-badge-yellow";
      break;
    case "MINOR":
      badgeClass = "g-badge-blue";
      break;
    default:
      badgeClass = "g-badge-grey";
  }

  return (
    <span className={`g-badge ${badgeClass}`}>
      {severity}
    </span>
  );
}