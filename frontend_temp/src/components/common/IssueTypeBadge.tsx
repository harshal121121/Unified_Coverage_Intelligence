interface Props {
  type: string;
}

export default function IssueTypeBadge({ type }: Props) {
  let badgeClass = "g-badge-grey";

  if (type === "BUG") {
    badgeClass = "g-badge-red";
  } else if (type === "VULNERABILITY") {
    badgeClass = "g-badge-red"; // or yellow, let's keep it red for critical alerts
  } else if (type === "CODE_SMELL") {
    badgeClass = "g-badge-blue";
  }

  return (
    <span className={`g-badge ${badgeClass}`}>
      {type ? type.replace("_", " ") : ""}
    </span>
  );
}