import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";

export default function QualityScoreTrendChart({
  data,
}: any) {

  const formattedData =
    data.map(
      (
        item: any,
        index: number
      ) => ({
        chartId: index + 1,

        buildNumber:
          item.buildNumber,

        coverage:
          Number(item.coverage),

        score:
          Number(item.score),

        bugs:
          Number(item.bugs),

        vulnerabilities:
          Number(
            item.vulnerabilities
          ),

        status:
          item.status,
      })
    );

  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: "var(--bg-card)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "25px",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3
        style={{
          marginBottom: 20,
          fontSize: 18,
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        Quality Trend Analysis
      </h3>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart
          data={formattedData}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 30,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--grey-200)"
          />

          <XAxis
            dataKey="chartId"
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            height={50}
          >
            <Label
              value="Build No."
              position="insideBottom"
              offset={0}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                fill: "var(--text-secondary)",
              }}
            />
          </XAxis>

          <YAxis
            domain={[0, 100]}
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            width={60}
          >
            <Label
              value="Coverage %"
              angle={-90}
              position="insideLeft"
              offset={-5}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                fill: "var(--text-secondary)",
                textAnchor: "middle",
              }}
            />
          </YAxis>

          <Tooltip
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              color: "var(--text-primary)",
            }}

            formatter={(
              value: any,
              name: any
            ) => {

              if (
                name ===
                "coverage"
              ) {
                return [
                  `${value}%`,
                  "Coverage",
                ];
              }

              if (
                name ===
                "score"
              ) {
                return [
                  `${value}%`,
                  "Project Health Score",
                ];
              }

              return [
                value,
                name,
              ];
            }}

            labelFormatter={(
              label,
              payload
            ) => {

              if (
                payload &&
                payload.length > 0
              ) {

                return `Build #${payload[0].payload.buildNumber}`;
              }

              return label;
            }}
          />

          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />

          {/* Coverage Line */}

          <Line
            type="monotone"

            dataKey="coverage"

            stroke="#22C55E"

            strokeWidth={3}

            dot={{ r: 4 }}

            activeDot={{
              r: 7,
            }}

            name="Coverage"
          />

          {/* Project Health Line */}

          <Line
            type="monotone"

            dataKey="score"

            stroke="#2563EB"

            strokeWidth={3}

            dot={{ r: 4 }}

            activeDot={{
              r: 7,
            }}

            name="Project Health Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}