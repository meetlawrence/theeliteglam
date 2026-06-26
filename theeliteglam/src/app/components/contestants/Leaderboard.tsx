import Image from "next/image";
import { Contestant } from "./types";

export function LeaderboardCol({ title, rows }: { title: string; rows: Contestant[] }) {
  const max = rows[0]?.votes ?? 1;
  return (
    <div>
      <div className="font-raleway text-[0.68rem] tracking-[0.3em] text-[#9A8C6A] uppercase mb-6 pb-3 border-b border-[rgba(201,168,76,0.12)]">{title}</div>
      {rows.map((c, i) => {
        const pct = Math.round((c.votes / max) * 100);
        const medal = ["✦", "✧", "◆"][i] ?? null;
        const medalColor: Record<number, string> = { 0: "#F0C04A", 1: "#C0C0C0", 2: "#CD7F32" };
        return (
          <div key={c.id} className="grid grid-cols-[28px_44px_1fr_70px] items-center gap-4 py-3 border-b border-[rgba(201,168,76,0.07)]">
            <div className="font-cinzel text-[0.82rem] text-center" style={{ color: medalColor[i] ?? "#5A5040" as string }}>{medal ?? i + 1}</div>
            <div className="relative w-[40px] h-[40px] overflow-hidden" style={{ border: i === 0 ? "1px solid rgba(240,192,74,0.5)" : "1px solid rgba(201,168,76,0.15)" }}>
              <Image src={c.image} alt={c.name} fill className="object-cover object-top" />
            </div>
            <div>
              <div className="font-cinzel text-[0.8rem] text-[#C4B896] mb-2">{c.name}</div>
              <div className="h-1 bg-[rgba(201,168,76,0.1)] rounded overflow-hidden">
                <div style={{ height: "100%", width: `${pct}%`, transition: "width 1s ease", background: i === 0 ? "linear-gradient(to right,#C9A84C,#F0C04A)" : "rgba(201,168,76,0.35)" }} />
              </div>
            </div>
            <div className={`font-cinzel text-[0.8rem] text-right ${i === 0 ? "text-[#F0C04A]" : "text-[#9A8C6A]"}`}>{c.votes.toLocaleString()}</div>
          </div>
        );
      })}
    </div>
  );
}

export default LeaderboardCol;
