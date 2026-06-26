"use client";

import { AdminButton } from "./AdminButton";
import type { Contestant } from "@/app/components/contestants/types";

interface AdminContestantOtherSectionProps {
  contestants: Contestant[];
  statusMap: Record<number, "active" | "finalist" | "eliminated">;
  highlightedId: number | null;
  onSelect: (contestant: Contestant) => void;
  onEdit: (contestant: Contestant) => void;
}

function statusLabel(status: "active" | "finalist" | "eliminated") {
  return status === "finalist" ? "Finalist" : status === "eliminated" ? "Eliminated" : "Active";
}

export default function AdminContestantOtherSection({
  contestants,
  statusMap,
  highlightedId,
  onSelect,
  onEdit,
}: AdminContestantOtherSectionProps) {
  if (!contestants.length) {
    return null;
  }

  return (
    <div className="mt-4 bg-[#0D0D0D] border border-[#1a170e] p-4">
      <div className="mb-3">
        <p className="text-sm font-semibold text-[#F5EDD6]">Other</p>
      </div>
      <div className="space-y-3">
        {contestants.map((contestant) => {
          const status = statusMap[contestant.id] ?? "active";
          const highlighted = highlightedId === contestant.id;
          const rowClass = highlighted ? "border-[#C9A84C] bg-[#111006]" : "border-[#1a170e] bg-[#0D0D0D]";

          return (
            <div
              id={`row-${contestant.id}`}
              key={contestant.id}
              className={`${rowClass} border p-3 flex items-center gap-3`}
            >
              <div className="relative w-14 h-14">
                <img src={contestant.image} alt={contestant.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1">
                <button onClick={() => onSelect(contestant)} className="text-left">
                  <div className="font-serif text-sm text-[#F5EDD6]">{contestant.name}</div>
                  <div className="text-[0.75rem] text-[#9A8C6A]">{contestant.number} · {contestant.state}</div>
                </button>
              </div>
              <div className="text-xs text-[#9A8C6A]">{statusLabel(status)}</div>
              <AdminButton label="Edit" variant="ghost" onClick={() => onEdit(contestant)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
