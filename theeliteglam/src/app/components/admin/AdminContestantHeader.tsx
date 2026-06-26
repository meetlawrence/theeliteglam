"use client";

import { AdminButton } from "./AdminButton";

interface AdminContestantHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onCreate: () => void;
}

export default function AdminContestantHeader({ query, onQueryChange, onCreate }: AdminContestantHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.36em] text-[#C9A84C]">Contestants Management</p>
        <h2 className="text-2xl font-serif text-[#F5EDD6]">All Contestants</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search name or number"
          className="min-w-[200px] p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
        />
        <AdminButton label="Create" variant="filled" onClick={onCreate} />
      </div>
    </div>
  );
}
