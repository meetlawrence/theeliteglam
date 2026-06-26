"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { TicketSalePoint } from "./AdminTicketTypes";

export default function AdminTicketSalesChart({ data }: { data: TicketSalePoint[] }) {
  return (
    <div className="border border-[#1a170e] bg-[#080808] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[#F5EDD6] font-serif text-lg">Ticket Sales</h2>
          <p className="text-[#9A8C6A] text-xs">Daily ticket sales trend</p>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#C9A84C" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a170e" vertical={false} />
            <XAxis dataKey="day" stroke="#9A8C6A" tick={{ fontSize: 11, fill: "#9A8C6A" }} axisLine={false} tickLine={false} />
            <YAxis stroke="#9A8C6A" tick={{ fontSize: 11, fill: "#9A8C6A" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ background: "#080808", borderColor: "#1a170e" }} labelStyle={{ color: "#F5EDD6" }} formatter={(value) => [`${value}`, "Tickets"]} />
            <Area type="monotone" dataKey="sold" stroke="#C9A84C" fillOpacity={1} fill="url(#colorSold)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
