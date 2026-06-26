"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface PieEntry {
  id: number;
  name: string;
  votes: number;
}

interface AdminContestantPieChartProps {
  data: PieEntry[];
  onSliceClick: (id: number) => void;
}

const COLORS = ["#C9A84C", "#94753A", "#A68552", "#B8956A", "#8B6914", "#6F5A2E"];

export default function AdminContestantPieChart({ data, onSliceClick }: AdminContestantPieChartProps) {
  return (
    <div className="mt-3">
      <div className="mb-3 text-xs text-[#9A8C6A]">Top Contestants (Votes)</div>
      <div className="bg-[#0D0D0D] border border-[#1a170e] p-3">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Tooltip formatter={(value) => (typeof value === "number" ? value.toLocaleString() : String(value))} />
            <Pie
              data={data}
              dataKey="votes"
              nameKey="name"
              cx="50%"
              cy="55%"
              outerRadius={90}
              innerRadius={40}
              paddingAngle={3}
              label={(props) => {
                const name = String(props.name ?? "");
                const percent = typeof props.percent === "number" ? props.percent : 0;
                return `${name} ${percent ? `${(percent * 100).toFixed(0)}%` : ""}`;
              }}
              onClick={(event: any) => {
                const id = event?.payload?.id;
                if (typeof id === "number") {
                  onSliceClick(id);
                }
              }}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
