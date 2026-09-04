"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = {
  city: string;
  value: number;
};

type AirQualityChartProps = {
  data: ChartPoint[];
  pollutant: string;
};

export default function AirQualityChart({
  data,
  pollutant,
}: AirQualityChartProps) {
  return (
    <div className="rounded-xl border border-[#1F2937] bg-[#0B1117] p-4">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
          AIR QUALITY TREND
        </div>

        <div className="mt-1 text-sm text-slate-300">
          {pollutant.toUpperCase()} measurement comparison
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1F2937"
            />

            <XAxis
              dataKey="city"
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
              axisLine={{
                stroke: "#1F2937",
              }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#94A3B8",
                fontSize: 11,
              }}
              axisLine={{
                stroke: "#1F2937",
              }}
              tickLine={false}
            />

            <Tooltip
  contentStyle={{
    backgroundColor: "#0B1117",
    border: "1px solid #1F2937",
    borderRadius: "8px",
  }}
  labelStyle={{
    color: "#94A3B8",
  }}
  formatter={(value) => [`${value} µg/m³`, "PM2.5"]}
  labelFormatter={(label) => `City: ${label}`}
/>

            <Line
              type="monotone"
              dataKey="value"
              stroke="#38BDF8"
              strokeWidth={2}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}