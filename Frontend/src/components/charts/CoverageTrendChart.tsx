import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Label,
} from "recharts";

interface Props {
  data: any[];
}

export default function CoverageTrendChart({ data }: Props) {

  // CLEAN + NORMALIZE DATA
  const formattedData = data.map((item: any, index: number) => ({
    buildId: index + 1,
    coverage: Number(item.coverage),
  }));

  return (
    <div
      style={{
        height: "350px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          marginBottom: "16px",
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "16px",
        }}
      >
        Coverage Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={formattedData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 30,
          }}
        >
          <CartesianGrid
            stroke="var(--grey-200)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="buildId"
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={8}
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
            stroke="var(--text-secondary)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            width={60}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
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
            content={({ active, payload, label }) => {

              if (!active || !payload || !payload.length) {
                return null;
              }

              // FORCE exact coverage value
              const coverage = payload[0].payload.coverage;

              return (
                <div
                  style={{
                    background: "#1f2937",
                    border: "none",
                    borderRadius: "4px",
                    color: "#f9fafb",
                    fontSize: "12px",
                    padding: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "6px",
                      color: "#9ca3af",
                    }}
                  >
                    Build #{label}
                  </div>

                  <div>
                    Coverage : <strong>{coverage}%</strong>
                  </div>
                </div>
              );
            }}
          />

          <Line
            type="monotone"
            dataKey="coverage"
            stroke="var(--google-blue-600)"
            strokeWidth={3}
            activeDot={{
              r: 6,
              strokeWidth: 0,
            }}
            dot={{
              r: 3,
              strokeWidth: 1,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}