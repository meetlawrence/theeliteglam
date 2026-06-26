"use client";

import { TicketMetric } from "./AdminTicketTypes";

export default function AdminTicketStats({ metrics }: { metrics: TicketMetric[] }) {
  return (
    <div className="flex gap-4 flex-wrap">
      {metrics.map((metric) => (
        <div key={metric.label} className="border border-[#1a170e] bg-[#080808] p-4">
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[#9A8C6A] mb-1">{metric.label}</p>
          <p className="text-2xl font-serif text-[#F5EDD6]">{metric.value}</p>
          <p className="text-xs text-[#9A8C6A] mt-2">{metric.note}</p>
        </div>
      ))}
    </div>
  );
}
