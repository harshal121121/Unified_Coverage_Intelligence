interface Props {
  status: string;
}

export default function RuleStatusBadge({ status }: Props) {
  const success = status === "PASS" || status === "PASSED";

  return (
    <span className={`g-badge ${success ? "g-badge-green" : "g-badge-red"}`}>
      {status}
    </span>
  );
}