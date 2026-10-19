"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";
import { AdminButton } from "./AdminButton";

interface RevenuePoint {
  label: string;
  value: number;
}

interface RevenueStats {
  total: number;
  average: number;
  highest: number;
  highestWeek: string;
  growth: string;
}

function calculateStats(data: RevenuePoint[]): RevenueStats {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = Math.round(total / data.length);
  const highest = Math.max(...data.map((d) => d.value));
  const highestWeek = data.find((d) => d.value === highest)?.label || "";

  const growth =
    data.length > 1
      ? Math.round(((data[data.length - 1].value - data[0].value) / data[0].value) * 100)
      : 0;

  return { total, average, highest, highestWeek, growth: `${growth > 0 ? "+" : ""}${growth}%` };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const percentage = ((value / 119480) * 100).toFixed(1);
    return (
      <div className="bg-[#0d0d0d] border border-[#C9A84C] p-3 shadow-lg">
        <p className="text-[#C9A84C] font-semibold text-sm">{data.label}</p>
        <p className="text-[#F5EDD6] text-xs">Revenue: ${value.toLocaleString()}</p>
        <p className="text-[#9A8C6A] text-xs">Of Total: {percentage}%</p>
      </div>
    );
  }
  return null;
};

export function AdminRevenuePanel({ data }: { data: RevenuePoint[] }) {
  const stats = calculateStats(data);
  const colors = ["#C9A84C", "#B8956A", "#A68552", "#94753A"];

  return (
    <div className="border border-[#1a170e] bg-[#080808] p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-[#F5EDD6] font-serif text-lg mb-1">Revenue Performance</h2>
          <p className="text-[#9A8C6A] text-xs">4-Week Revenue Breakdown</p>
        </div>
        <AdminButton label="View Report" variant="ghost" />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-[#0d0d0d] border border-[#1a170e] p-2">
          <p className="text-[#9A8C6A] text-xs uppercase tracking-widest mb-0.5">Total Revenue</p>
          <p className="text-[#C9A84C] font-serif text-base">${(stats.total / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-[#0d0d0d] border border-[#1a170e] p-2">
          <p className="text-[#9A8C6A] text-xs uppercase tracking-widest mb-0.5">Weekly Avg</p>
          <p className="text-[#F5EDD6] font-serif text-base">
            ${(stats.average / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="bg-[#0d0d0d] border border-[#1a170e] p-2">
          <p className="text-[#9A8C6A] text-xs uppercase tracking-widest mb-0.5">Highest Week</p>
          <p className="text-[#F5EDD6] font-serif text-base">
            ${(stats.highest / 1000).toFixed(1)}K
          </p>
          <p className="text-[#9A8C6A] text-xs">{stats.highestWeek}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-[#1a170e] p-2">
          <p className="text-[#9A8C6A] text-xs uppercase tracking-widest mb-0.5">Growth</p>
          <p
            className={`font-serif text-base ${stats.growth.includes("+") ? "text-[#4ade80]" : "text-[#ef4444]"}`}
          >
            {stats.growth}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a170e" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#444"
            tick={{ fontSize: 11, fill: "#9A8C6A" }}
            axisLine={{ stroke: "#1a170e" }}
            tickLine={false}
          />
          <YAxis
            stroke="#1a170e"
            tick={{ fontSize: 11, fill: "#9A8C6A" }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" isAnimationActive animationDuration={800}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 pt-3 border-t border-[#1a170e] flex justify-between text-[0.6rem]">
        <p className="text-[#9A8C6A]">Data refreshed live • Week 1-4 of current month</p>
        <p className="text-[#9A8C6A]">Currency: USD</p>
      </div>
    </div>
  );
}
