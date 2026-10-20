"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

interface BarEntry {
  id: number;
  name: string;
  votes: number;
}

interface AdminContestantBarChartProps {
  data: BarEntry[];
  onBarClick?: (id: number) => void;
}

const COLORS = ["#C9A84C", "#94753A", "#A68552", "#B8956A", "#8B6914", "#6F5A2E"];

export default function AdminContestantBarChart({
  data,
  onBarClick,
}: AdminContestantBarChartProps) {
  return (
    <div className="mt-3 w-full">
      <div className="mb-3 text-xs font-medium tracking-wide uppercase text-[#9A8C6A]">
        Top Contestants (Votes)
      </div>
      <div className="bg-[#0D0D0D] border border-[#1a170e] rounded-xl p-3 sm:p-4 shadow-lg w-full overflow-hidden">
        <div className="w-full h-[260px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1c13" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#555"
                tick={{ fill: "#9A8C6A", fontSize: 10 }}
                angle={-30}
                textAnchor="end"
                interval={0}
                tickFormatter={(value) => (value.length > 10 ? `${value.substring(0, 9)}...` : value)}
              />
              <YAxis
                stroke="#555"
                tick={{ fill: "#9A8C6A", fontSize: 10 }}
                tickFormatter={(value) => value.toLocaleString()}
                width={35}
              />
              <Tooltip
                cursor={{ fill: "rgba(201, 168, 76, 0.05)" }}
                contentStyle={{
                  backgroundColor: "#141414",
                  borderColor: "#262217",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                formatter={(value: any) => [
                  typeof value === "number" ? value.toLocaleString() : value,
                  "Votes",
                ]}
              />
              <Bar
                dataKey="votes"
                radius={[4, 4, 0, 0]}
                onClick={(entry: any) => {
                  const id = entry?.id;
                  if (typeof id === "number" && onBarClick) {
                    onBarClick(id);
                  }
                }}
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                    className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}