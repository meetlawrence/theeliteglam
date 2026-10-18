"use client";

import React, { useMemo, useState } from "react";
import { useContestants } from "@/app/components/contestant/useContestants";
import AdminContestantHeader from "../../AdminContestantHeader";
import AdminContestantBarChart from "../../AdminContestantBarChart";
import AdminContestantCategorySection from "../../AdminContestantCategorySection";
import AdminContestantOtherSection from "../../AdminContestantOtherSection";
import { AdminContestantEditorModal } from "../../AdminContestantEditorModal";
import type { Contestant } from "@/app/components/contestant/types";

export function ContestantsView() {
  const { contestants, reloadContestants } = useContestants();
  
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "finalist" | "eliminated">("all");
  const [statusMap, setStatusMap] = useState<Record<number, "active" | "finalist" | "eliminated">>({});
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // Modal states (unified)
  const [selectedContestantId, setSelectedContestantId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contestants
      .filter((contestant) => {
        const nameMatch =
          !q ||
          contestant.name.toLowerCase().includes(q) ||
          contestant.number.toLowerCase().includes(q);
        const status = statusMap[contestant.id] ?? "active";
        const statusMatch = filter === "all" ? true : status === filter;
        return nameMatch && statusMatch;
      })
      .sort((a, b) => b.votes - a.votes);
  }, [contestants, query, filter, statusMap]);

  // Open modal handler for editing
  const handleEdit = (contestant: Contestant) => {
    if (!contestant.databaseId) return;
    setSelectedContestantId(contestant.databaseId);
  };

  // Handle successful update inside the modal
  const handleContestantUpdated = (updatedContestant: Contestant) => {
    reloadContestants();
  };

  const barChartData = useMemo(() => {
    const copy = [...contestants].sort((a, b) => b.votes - a.votes);
    return copy.map((contestant) => ({
      id: contestant.id,
      name: contestant.number || contestant.name.split(" ")[0],
      votes: contestant.votes,
    }));
  }, [contestants]);

  return (
    <>
      <div className="space-y-6 w-full max-w-7xl mx-auto  lg:pb-12">
        {/* Header section matching overview layout pattern */}
        <DashboardHeaderWrapper query={query} onQueryChange={setQuery} />

        {/* Bar Chart Section */}
        <div className="w-full overflow-x-auto">
          <AdminContestantBarChart
            data={barChartData}
            onBarClick={(id) => {
              setHighlightedId(id);
              const element = document.getElementById(`row-${id}`);
              if (element)
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />
        </div>

        {/* Main Categories Section (Men & Women Side-by-Side on Desktop, Stacked on Mobile) */}
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Men Category Card */}
            <div className="bg-[#0D0D0D] border border-[rgba(201,168,76,0.18)] rounded-none relative overflow-hidden flex flex-col p-4 sm:p-6">
              <AdminContestantCategorySection
                title="Men"
                contestants={filtered.filter(
                  (contestant) => contestant.gender?.toLowerCase() === "male",
                )}
                statusMap={statusMap}
                highlightedId={highlightedId}
                onEdit={handleEdit}
              />
            </div>

            {/* Women Category Card */}
            <div className="bg-[#0D0D0D] border border-[rgba(201,168,76,0.18)] rounded-none relative overflow-hidden flex flex-col p-4 sm:p-6">
              <AdminContestantCategorySection
                title="Women"
                contestants={filtered.filter(
                  (contestant) => contestant.gender?.toLowerCase() === "female",
                )}
                statusMap={statusMap}
                highlightedId={highlightedId}
                onEdit={handleEdit}
              />
            </div>
          </div>

          
        </div>
      </div>
      <AdminContestantEditorModal
        open={selectedContestantId !== null}
        contestantId={selectedContestantId}
        onClose={() => setSelectedContestantId(null)}
        onContestantUpdated={handleContestantUpdated}
      />
    </>
  );
}

function DashboardHeaderWrapper({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (q: string) => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center w-full">
      <AdminContestantHeader query={query} onQueryChange={onQueryChange} />
    </div>
  );
}