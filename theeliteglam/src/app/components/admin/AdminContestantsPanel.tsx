"use client";

import React, { useMemo, useState } from "react";
import { useContestants } from "@/app/components/contestants/useContestants";
import AdminContestantHeader from "./AdminContestantHeader";
import AdminContestantFilters from "./AdminContestantFilters";
import AdminContestantPieChart from "./AdminContestantPieChart";
import AdminContestantCategorySection from "./AdminContestantCategorySection";
import AdminContestantOtherSection from "./AdminContestantOtherSection";
import AdminContestantModal from "./AdminContestantModal";
import type { Contestant } from "@/app/components/contestants/types";

export default function AdminContestantsPanel() {
  const { contestants: base } = useContestants();
  const [list, setList] = useState<Contestant[]>(base);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState<Contestant | null>(null);
  const [filter, setFilter] = useState<"all" | "finalist" | "eliminated">("all");
  const [statusMap, setStatusMap] = useState<Record<number, "active" | "finalist" | "eliminated">>(
    () =>
      Object.fromEntries(base.map((c) => [c.id, "active"])) as Record<
        number,
        "active" | "finalist" | "eliminated"
      >
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list
      .filter((c) => {
        const nameMatch =
          !q || c.name.toLowerCase().includes(q) || c.number.toLowerCase().includes(q);
        const status = statusMap[c.id] ?? "active";
        const statusMatch = filter === "all" ? true : status === filter;
        return nameMatch && statusMatch;
      })
      .sort((a, b) => b.votes - a.votes);
  }, [list, query, filter, statusMap]);

  const handleCreate = () => {
    const empty: Contestant = {
      id: Date.now(),
      name: "New Contestant",
      state: "",
      age: 18,
      gender: "female",
      number: "",
      bio: "",
      image: "/images/placeholder.png",
      votes: 0,
      occupation: "",
      advocacy: "",
      funFact: "",
      tribe: "",
    };
    setList((s) => [empty, ...s]);
    setStatusMap((m) => ({ ...m, [empty.id]: "active" }));
    setActive(empty);
    setModalOpen(true);
  };

  const handleSave = (c: Contestant) => setList((s) => s.map((it) => (it.id === c.id ? c : it)));
  const handleEliminate = (id: number) => setStatusMap((m) => ({ ...m, [id]: "eliminated" }));
  const handleMarkFinalist = (id: number) => setStatusMap((m) => ({ ...m, [id]: "finalist" }));
  const handleRestore = (id: number) => setStatusMap((m) => ({ ...m, [id]: "active" }));

  const pieData = useMemo(() => {
    const copy = [...list].sort((a, b) => b.votes - a.votes);
    const max = copy.length ? copy[0].votes : 1;
    return copy.map((c) => ({
      id: c.id,
      name: c.number || c.name.split(" ")[0],
      votes: c.votes,
      pct: Math.round((c.votes / max) * 100),
    }));
  }, [list]);

  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="border border-[#1a170e] bg-[#080808] p-6">
        <AdminContestantHeader query={query} onQueryChange={setQuery} onCreate={handleCreate} />

        <AdminContestantFilters filter={filter} onChange={setFilter} />

        <AdminContestantPieChart
          data={pieData}
          onSliceClick={(id) => {
            setHighlightedId(id);
            const el = document.getElementById(`row-${id}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <AdminContestantCategorySection
            title="Men"
            contestants={filtered.filter((c) => c.gender?.toLowerCase() === "male")}
            statusMap={statusMap}
            highlightedId={highlightedId}
            onSelect={(contestant) => {
              setActive(contestant);
              setModalOpen(true);
            }}
            onEdit={(contestant) => {
              setActive(contestant);
              setModalOpen(true);
            }}
          />

          <AdminContestantCategorySection
            title="Women"
            contestants={filtered.filter((c) => c.gender?.toLowerCase() === "female")}
            statusMap={statusMap}
            highlightedId={highlightedId}
            onSelect={(contestant) => {
              setActive(contestant);
              setModalOpen(true);
            }}
            onEdit={(contestant) => {
              setActive(contestant);
              setModalOpen(true);
            }}
          />
        </div>

        <AdminContestantOtherSection
          contestants={filtered.filter(
            (c) => !["male", "female"].includes((c.gender || "").toLowerCase())
          )}
          statusMap={statusMap}
          highlightedId={highlightedId}
          onSelect={(contestant) => {
            setActive(contestant);
            setModalOpen(true);
          }}
          onEdit={(contestant) => {
            setActive(contestant);
            setModalOpen(true);
          }}
        />
      </div>

      <AdminContestantModal
        open={modalOpen}
        contestant={active}
        status={active ? statusMap[active.id] : undefined}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={(id) => {
          handleEliminate(id);
          setModalOpen(false);
        }}
        onMarkFinalist={(id) => handleMarkFinalist(id)}
        onRestore={(id) => handleRestore(id)}
      />
    </div>
  );
}
