"use client";

import { AdminButton } from "./AdminButton";
import type { Contestant } from "@/app/components/contestants/types";

interface AdminContestantCategorySectionProps {
  title: string;
  contestants: Contestant[];
  statusMap: Record<number, "active" | "finalist" | "eliminated">;
  highlightedId: number | null;
  onSelect: (contestant: Contestant) => void;
  onEdit: (contestant: Contestant) => void;
}

function statusLabel(status: "active" | "finalist" | "eliminated") {
  return status === "finalist" ? "Finalist" : status === "eliminated" ? "Eliminated" : "Active";
}

export default function AdminContestantCategorySection({
  title,
  contestants,
  statusMap,
  highlightedId,
  onSelect,
  onEdit,
}: AdminContestantCategorySectionProps) {
  return (
    <div className="bg-[#0D0D0D] border border-[#1a170e] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#F5EDD6]">{title}</p>
          <p className="text-xs text-[#9A8C6A]">{contestants.length} contestants</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#1a170e] text-xs uppercase text-[#9A8C6A]">
            <tr>
              <th className="px-3 py-2">Contestant</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">Votes</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {contestants.map((contestant) => {
              const status = statusMap[contestant.id] ?? "active";
              const highlighted = highlightedId === contestant.id;
              return (
                <tr
                  id={`row-${contestant.id}`}
                  key={contestant.id}
                  className={`${highlighted ? "bg-[#111006] border-l-4 border-[#C9A84C]" : "border-b border-[#1a170e]"}`}
                >
                  <td className="px-3 py-3 align-top">
                    <button
                      onClick={() => onSelect(contestant)}
                      className="flex items-center gap-3 text-left w-full"
                    >
                      <img src={contestant.image} alt={contestant.name} className="w-10 h-10 object-cover" />
                      <div>
                        <div className="font-serif text-sm text-[#F5EDD6]">{contestant.name}</div>
                        <div className="text-[0.7rem] text-[#9A8C6A]">{contestant.number}</div>
                      </div>
                    </button>
                  </td>
                  <td className="px-3 py-3 align-top text-[#F5EDD6]">{contestant.state}</td>
                  <td className="px-3 py-3 align-top text-[#F5EDD6]">{contestant.votes.toLocaleString()}</td>
                  <td className="px-3 py-3 align-top text-[#9A8C6A]">{statusLabel(status)}</td>
                  <td className="px-3 py-3 align-top">
                    <AdminButton label="Edit" variant="ghost" onClick={() => onEdit(contestant)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
