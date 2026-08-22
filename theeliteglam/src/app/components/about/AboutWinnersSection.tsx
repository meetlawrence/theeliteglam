"use client";

import { useState } from "react";
import { SectionLabel } from "./AboutShared";

type WinnerData = {
  name: string;
  title: string;
  state: string;
  age: string;
  occupation: string;
  advocacy: string;
  quote: string;
  image: string;
};

type RunnerUpData = {
  name: string;
  title: string;
  state: string;
  occupation: string;
  image: string;
};

type AboutWinnersSectionProps = {
  winners: WinnerData[];
  runnersUp: RunnerUpData[];
};

export function AboutWinnersSection({ winners, runnersUp }: AboutWinnersSectionProps) {
  return (
    <div className="mx-auto max-w-[1300px] px-8 py-28">
      <SectionLabel text="Hall of Champions" />
      <h2 className="mt-4 mb-3 font-['Cinzel',serif] text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.1] tracking-[0.05em] text-[#F5EDD6]">
        Past{" "}
        <span className="bg-[linear-gradient(135deg,#C9A84C,#F0C04A)] bg-clip-text text-transparent">
          Winners
        </span>
      </h2>
      <p className="mb-14 max-w-[520px] font-['Playfair_Display',serif] text-[1rem] italic leading-[1.7] text-[#9A8C6A]">
        The inaugural crowns of The Elite Glam — awarded at the 2025 Grand Finale in Calabar.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {winners.map((winner) => (
          <WinnerCard key={winner.name} winner={winner} />
        ))}
      </div>

      <div className="mt-12">
        <div className="mb-7 flex items-center gap-5">
          <span className="inline-block h-px w-6 bg-[rgba(201,168,76,0.3)]" />
          <span className="font-['Raleway',sans-serif] text-[0.6rem] uppercase tracking-[0.4em] text-[#9A8C6A]">
            1st Runners-Up · Season 1
          </span>
          <span className="h-px flex-1 bg-[rgba(201,168,76,0.1)]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {runnersUp.map((runner) => (
            <RunnerUpCard key={runner.name} runner={runner} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WinnerCard({ winner }: { winner: WinnerData }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`overflow-hidden border bg-[#0D0D0D] transition-all duration-400 ${hovered ? "border-[rgba(201,168,76,0.35)] shadow-[0_0_50px_rgba(201,168,76,0.08)]" : "border-[rgba(201,168,76,0.12)]"}`}
    >
      <div className="relative overflow-hidden pb-[95%]">
        <img
          src={winner.image}
          alt={winner.name}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-transform duration-600 ${hovered ? "scale-[1.03]" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,13,1)_0%,rgba(13,13,13,0.2)_55%,transparent_100%)]" />
        <div className="absolute left-5 top-5 border border-[rgba(201,168,76,0.35)] bg-[rgba(8,8,8,0.8)] px-3 py-1.5 font-['Cinzel',serif] text-[0.62rem] uppercase tracking-[0.2em] text-[#F0C04A] backdrop-blur">
          ✦ Season 1 · 2025
        </div>
      </div>

      <div className="p-7">
        <div className="mb-1 font-['Raleway',sans-serif] text-[0.62rem] uppercase tracking-[0.35em] text-[#9A8C6A]">
          {winner.state} · Age {winner.age}
        </div>
        <h3 className="mb-1 font-['Cinzel',serif] text-[1.2rem] leading-[1.15] tracking-[0.04em] text-[#F5EDD6]">
          {winner.name}
        </h3>
        <div className="mb-5 font-['Raleway',sans-serif] text-[0.68rem] uppercase tracking-[0.22em] text-[#F0C04A]">
          {winner.title}
        </div>
        <div className="mb-5 h-px bg-[rgba(201,168,76,0.1)]" />
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          {[
            { label: "Profession", value: winner.occupation },
            { label: "Advocacy", value: winner.advocacy },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="mb-1 font-['Raleway',sans-serif] text-[0.58rem] uppercase tracking-[0.28em] text-[#C9A84C]">
                {label}
              </div>
              <div className="font-['Raleway',sans-serif] text-[0.82rem] leading-[1.5] text-[#9A8C6A]">
                {value}
              </div>
            </div>
          ))}
        </div>

        <blockquote className={`border-l-2 pl-4 ${hovered ? "border-[rgba(201,168,76,0.66)]" : "border-[rgba(201,168,76,0.35)]"}`}>
          <p className="font-['Playfair_Display',serif] text-[0.88rem] italic leading-[1.75] text-[#C4B896]">
            “{winner.quote}”
          </p>
        </blockquote>
      </div>
    </div>
  );
}

function RunnerUpCard({ runner }: { runner: RunnerUpData }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`overflow-hidden border bg-[#0D0D0D] transition-all duration-400 ${hovered ? "border-[rgba(201,168,76,0.25)] shadow-[0_0_30px_rgba(201,168,76,0.05)]" : "border-[rgba(201,168,76,0.08)]"}`}
    >
      <div className="relative overflow-hidden pb-[120%]">
        <img
          src={runner.image}
          alt={runner.name}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-transform duration-600 ${hovered ? "scale-104" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(13,13,13,0.95)_0%,rgba(13,13,13,0.1)_55%,transparent_100%)]" />
        <div className="absolute left-3 top-3 border border-[rgba(201,168,76,0.2)] bg-[rgba(8,8,8,0.75)] px-2 py-1 font-['Cinzel',serif] text-[0.52rem] uppercase tracking-[0.18em] text-[#9A8C6A] backdrop-blur">
          2025
        </div>
      </div>

      <div className="p-4 pb-5">
        <div className="mb-1 font-['Raleway',sans-serif] text-[0.55rem] uppercase tracking-[0.28em] text-[#9A8C6A]">
          {runner.state}
        </div>
        <div className="mb-1 font-['Cinzel',serif] text-[0.88rem] leading-[1.2] tracking-[0.04em] text-[#F5EDD6]">
          {runner.name}
        </div>
        <div className="mb-4 font-['Raleway',sans-serif] text-[0.58rem] uppercase tracking-[0.18em] text-[#C9A84C]">
          {runner.title}
        </div>
        <div className="mb-4 h-px bg-[rgba(201,168,76,0.08)]" />
        <div className="font-['Raleway',sans-serif] text-[0.72rem] leading-[1.5] text-[#5A5040]">
          {runner.occupation}
        </div>
      </div>
    </div>
  );
}
