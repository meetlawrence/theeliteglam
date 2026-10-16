import LeaderboardCol from "./Leaderboard";
import { Trophy } from "lucide-react";
import type { Contestant } from "./types";

export default function LeaderboardSection({
  femaleRanked,
  maleRanked,
}: {
  femaleRanked: Contestant[];
  maleRanked: Contestant[];
}) {
  return (
    <section className="py-24">
      <div className="max-w-325 mx-auto px-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={18} className="text-[#C9A84C]" />
          <div className="flex items-center gap-3 font-raleway text-[0.68rem] tracking-[0.3em] uppercase text-[#C9A84C]">
            <span className="inline-block h-px w-8 bg-[#C9A84C]" />
            Live Leaderboard
          </div>
        </div>

        <h2 className="font-cinzel text-[clamp(1.5rem,3vw,2.4rem)] text-[#F5EDD6] tracking-wider mb-12">
          Who&apos;s Leading the Race?
        </h2>

        <div className="grid grid-col-1 gap-12 md:grid-cols-2">
          <LeaderboardCol title="♀  Female Category" rows={femaleRanked} />
          <LeaderboardCol title="♂  Male Category" rows={maleRanked} />
        </div>
      </div>
    </section>
  );
}
