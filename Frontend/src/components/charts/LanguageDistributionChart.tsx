import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["var(--google-blue-600)", "var(--google-green-600)"];

export default function LanguageDistributionChart({
  javaCoverage,
  cppCoverage,
}: any) {
  const data = [
    {
      name: "Java",
      value: javaCoverage,
    },
    {
      name: "C++",
      value: cppCoverage,
    },
  ];

  return (
    <div style={{ height: "350px", display: "flex", flexDirection: "column" }}>
      <h3 style={{ marginBottom: "16px", fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "16px" }}>
        Languages
      </h3>

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
            paddingAngle={4}
            labelLine={false}
            label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
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
            formatter={(value: any) => [`${value}%`, "Coverage"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}