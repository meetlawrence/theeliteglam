"use client";

import { useState } from "react";
import { AdminContestantEditorModal } from "@/app/components/admin/AdminContestantEditorModal";
import type { Contestant } from "@/app/components/admin/AdminDashboardTypes";

interface DashboardMainGridProps {
  contestants: Contestant[];
  isLoading: boolean;
  error: string;
  onContestantUpdated?: (contestant: Contestant) => void; // Optional if handled via route revalidation
}

export function DashboardMainGrid({
  contestants,
  isLoading,
  error,
  onContestantUpdated,
}: DashboardMainGridProps) {
  const [selectedContestantId, setSelectedContestantId] = useState<string | null>(
    null,
  );

  // Filter & sort contestants: Pending first (Gold), Active middle (Green), Inactive bottom (Red)
  const sortedContestants = [...contestants].sort((a, b) => {
    const getPriority = (status: string) => {
      const s = status.toUpperCase();
      if (s === "PENDING") return 1;
      if (s === "ACTIVE") return 2;
      return 3; // INACTIVE / DECLINED
    };
    return getPriority(a.status) - getPriority(b.status);
  });

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PENDING") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] text-[#C9A84C]">
          Pending
        </span>
      );
    }
    if (s === "ACTIVE") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider bg-emerald-950/40 border border-emerald-800/50 text-emerald-400">
          Approved
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider bg-red-950/40 border border-red-900/50 text-red-400">
        Inactive
      </span>
    );
  };

  return (
    <>
      <section className="grid gap-6 w-full">
        <div className="bg-[#131313] border border-[rgba(201,168,76,0.18)] p-4 sm:p-6 rounded-none relative overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[rgba(201,168,76,0.12)]">
          <div>
            <span className="font-cinzel text-[0.65rem] text-[#C9A84C] uppercase block mb-1">
              Records
            </span>
            <h2 className="font-cinzel text-lg sm:text-xl text-[#F5EDD6]">
              Registered Contestants Directory
            </h2>
          </div>
          <span className="self-start sm:self-auto font-raleway text-xs text-[#C4B896] bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] px-3 py-1">
            Total: {contestants.length}
          </span>
        </div>

        <div className="overflow-x-auto w-full flex-1 -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="border-b border-[rgba(201,168,76,0.15)] font-raleway text-[0.68rem] tracking-[0.2em] sm:tracking-[0.25em] text-[#C9A84C] uppercase">
                <th className="py-3 px-3 sm:px-4">Contestant</th>
                <th className="py-3 px-3 sm:px-4">Gender</th>
                <th className="py-3 px-3 sm:px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(201,168,76,0.06)] font-raleway text-xs text-[#F5EDD6]">
              {sortedContestants.map((contestant) => (
                <tr
                  key={contestant.id}
                  className="hover:bg-[rgba(201,168,76,0.03)] transition-colors duration-200"
                >
                  <td className="py-3.5 px-3 sm:px-4">
                    <div className="flex items-center gap-3">
                      {contestant.image ? (
                        <img
                          src={contestant.image}
                          alt={contestant.name}
                          className="w-9 h-9 rounded-full border border-[rgba(201,168,76,0.3)] object-cover object-top shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.08)] flex items-center justify-center text-[#C9A84C] font-cinzel shrink-0 text-xs">
                          {contestant.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedContestantId(contestant.id)}
                        className="font-cinzel text-left text-xs sm:text-[0.88rem] text-[#F5EDD6] hover:text-[#C9A84C] transition-colors leading-tight underline underline-offset-2 decoration-[rgba(201,168,76,0.3)]"
                      >
                        {contestant.name}
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 capitalize tracking-wider text-[11px] sm:text-xs whitespace-nowrap text-[#C4B896]">
                    {contestant.gender.toLowerCase()}
                  </td>
                  <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                    {getStatusBadge(contestant.status)}
                  </td>
                </tr>
              ))}
              {!isLoading && !error && contestants.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground font-raleway text-xs">
                    No contestants have been returned by the API.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-muted-foreground font-raleway text-xs">
                    Loading contestants...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={3} role="alert" className="py-8 text-center text-red-400 font-raleway text-xs">
                    {error}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </section>
      <AdminContestantEditorModal
        open={selectedContestantId !== null}
        contestantId={selectedContestantId}
        onClose={() => setSelectedContestantId(null)}
        onContestantUpdated={onContestantUpdated}
      />
    </>
  );
}

export default DashboardMainGrid;