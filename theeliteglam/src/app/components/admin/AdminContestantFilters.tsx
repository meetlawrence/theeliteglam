"use client";

import { AdminButton } from "./AdminButton";

interface AdminContestantFiltersProps {
  filter: "all" | "finalist" | "eliminated";
  onChange: (value: "all" | "finalist" | "eliminated") => void;
}

export default function AdminContestantFilters({ filter, onChange }: AdminContestantFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-[#F5EDD6]">
      <div className="flex items-center gap-2">
        <span className="text-[#9A8C6A]">Status:</span>
        <AdminButton label="All" variant={filter === "all" ? "filled" : "ghost"} onClick={() => onChange("all")} />
        <AdminButton label="Finalists" variant={filter === "finalist" ? "filled" : "ghost"} onClick={() => onChange("finalist")} />
        <AdminButton label="Eliminated" variant={filter === "eliminated" ? "filled" : "ghost"} onClick={() => onChange("eliminated")} />
      </div>
    </div>
  );
}
