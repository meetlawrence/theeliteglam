"use client";

import { useState } from "react";

export type TimelineStep = {
  date: string;
  title: string;
  desc: string;
  icon: string;
  tag?: string | null;
};

export default function TimelineCard({
  step,
  index,
  inView,
}: {
  step: TimelineStep;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const delay = `${0.3 + index * 0.15}s`;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden p-10 cursor-default transition-all duration-300 ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
      style={{
        transitionDelay: delay,
        background: hovered ? "#111111" : "#0D0D0D",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.12)"}`,
        boxShadow: hovered ? "0 0 40px rgba(201,168,76,0.08)" : "none",
      }}
    >
      <div className="absolute -top-2 right-4 font-cinzel text-[5rem] text-[rgba(201,168,76,0.05)] leading-none select-none">
        {step.icon}
      </div>

      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="font-raleway text-[0.68rem] tracking-[0.25em] text-[#C9A84C] uppercase">
          {step.date}
        </div>
        {step.tag && (
          <span className="font-raleway text-[0.58rem] tracking-[0.18em] uppercase text-accent border border-[rgba(240,192,74,0.35)] px-2 py-0.5 bg-[rgba(240,192,74,0.06)]">
            {step.tag}
          </span>
        )}
      </div>

      <h3 className="font-cinzel text-[1.1rem] text-[#F5EDD6] tracking-wider mb-3 leading-[1.3]">
        {step.title}
      </h3>
      <p className="font-raleway text-[0.9rem] text-muted-foreground leading-[1.7]">{step.desc}</p>
    </div>
  );
}
