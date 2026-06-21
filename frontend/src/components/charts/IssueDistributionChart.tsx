import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  summary: any;
}

export default function IssueDistributionChart({
  summary,
}: Props) {

  const data = [
    {
      name: "Bugs",
      value: summary.bugs,
    },
    {
      name: "Vulnerabilities",
      value:
        summary.vulnerabilities,
    },
    {
      name: "Code Smells",
      value:
        summary.codeSmells,
    },
  ];

  const colors = [
    "var(--google-red-600)",
    "var(--google-red-700)",
    "var(--google-blue-600)",
  ];

  return (
    <div style={{ height: "350px", display: "flex", flexDirection: "column" }}>
      <h2 style={{ marginBottom: "16px", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "16px" }}>
        Issue Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={60}
            paddingAngle={3}
            labelLine={false}
            animationDuration={400}
            label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "var(--grey-900)",
              border: "none",
              borderRadius: "4px",
              color: "white",
              fontSize: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}