import React from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import type { Contestant, Gender } from "./types";

export function ContestantGrid({
  gridPool,
  isLoading,
  loadError,
  gridFilter,
  setGridFilter,
  openVotePayment,
  setSelected,
  flash,
}: {
  gridPool: Contestant[];
  isLoading: boolean;
  loadError: string;
  gridFilter: "all" | Gender;
  setGridFilter: (f: "all" | Gender) => void;
  openVotePayment: (c: Contestant) => void;
  setSelected: (c: Contestant | null) => void;
  flash: number | null;
}) {
  return (
    <div className="bg-[#060606] py-24">
      <div className="max-w-[1300px] mx-auto px-8">
        <div className="flex items-end justify-between flex-wrap gap-6 mt-4 mb-12">
          <h2 className="font-cinzel text-[clamp(1.5rem,3vw,2.4rem)] text-[#F5EDD6] tracking-[0.05em]">
            Season 2 Lineup
          </h2>
          <div className="flex">
            {(["all", "female", "male"] as ("all" | Gender)[]).map((f, idx) => (
              <button
                key={f}
                onClick={() => setGridFilter(f)}
                className={`font-raleway text-[0.68rem] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-300 ${gridFilter === f ? "text-accent bg-[rgba(201,168,76,0.07)] border border-[rgba(201,168,76,0.35)]" : "text-muted-foreground border border-[rgba(201,168,76,0.1)]"} ${idx > 0 ? "-ml-px" : ""}`}
              >
                {f === "all" ? "All" : f === "female" ? "Female" : "Male"}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p className="py-12 text-center font-raleway text-sm text-[#C4B896]">
            Loading approved contestants...
          </p>
        ) : loadError ? null : gridPool.length === 0 ? (
          <p className="py-12 text-center font-raleway text-sm text-[#C4B896]">
            No approved contestants are available for this selection.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-5">
            {gridPool.map((c) => (
              <GridCard
                key={c.id}
                contestant={c}
                flashing={flash === c.id}
                onVote={() => openVotePayment(c)}
                onSelect={() => setSelected(c)}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">{/* CTA left to parent if needed */}</div>
      </div>
    </div>
  );
}

function GridCard({
  contestant,
  flashing,
  onVote,
  onSelect,
}: {
  contestant: Contestant;
  flashing: boolean;
  onVote: () => void;
  onSelect: () => void;
}) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onSelect}
      className={`relative overflow-hidden transition-all duration-400 bg-[#0D0D0D] ${hov ? "-translate-y-1 shadow-2xl" : ""}`}
      style={{
        cursor: "pointer",
        border: `1px solid ${hov ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.13)"}`,
      }}
    >
      <div className="relative" style={{ paddingBottom: "135%" }}>
        <Image
          src={contestant.image}
          alt={contestant.name}
          fill
          className={`object-cover object-top transition-transform duration-500 ${hov ? "scale-[1.06]" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent" />
        <div className="absolute top-3 left-3 font-cinzel text-[0.58rem] tracking-[0.15em] text-[#C9A84C] bg-black/70 px-2 py-1 border border-[rgba(201,168,76,0.3)]">
          {contestant.number}
        </div>
      </div>

      <div className="p-4">
        <div className="font-cinzel text-[0.88rem] text-[#F5EDD6] mb-1">{contestant.name}</div>
        <div className="font-raleway text-[0.62rem] tracking-[0.18em] text-[#C9A84C] uppercase mb-3">
          {contestant.state}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(201,168,76,0.09)]">
          <div className="flex items-center gap-2">
            <Heart size={12} className="text-[#C9A84C]" />
            <span
              className={`font-cinzel text-[0.78rem] ${flashing ? "text-[#F0C04A]" : "text-[#9A8C6A]"}`}
            >
              {contestant.votes.toLocaleString()}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote();
            }}
            className="font-cinzel text-[0.58rem] uppercase px-3 py-2 bg-[linear-gradient(135deg,#C9A84C,#8B6914)] text-[#080808] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(201,168,76,0.25)] active:scale-95"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContestantGrid;
