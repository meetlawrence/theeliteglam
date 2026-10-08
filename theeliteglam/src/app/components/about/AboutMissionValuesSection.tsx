"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { SectionLabel } from "../ui/SectionDivider";

type MissionVisionCardData = {
  tag: string;
  heading: string;
  body: string;
};

type ValueItem = {
  icon: ReactNode;
  title: string;
  body: string;
};

type AboutMissionValuesSectionProps = {
  missionVisionCards: MissionVisionCardData[];
  values: ValueItem[];
  inView: boolean;
};

export function AboutMissionValuesSection({ missionVisionCards, values, inView }: AboutMissionValuesSectionProps) {
  return (
    <div id="mission" className="mx-auto max-w-[1300px] px-8 py-28 transition-all duration-1000">
      <SectionLabel text="What Drives Us" />

      <div className="mt-10 mb-16 grid gap-6 lg:grid-cols-2">
        {missionVisionCards.map(({ tag, heading, body }) => (
          <MvvCard key={tag} tag={tag} heading={heading} body={body} />
        ))}
      </div>

      <SectionLabel text="Our Values" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {values.map((value, index) => (
          <ValueCard key={value.title} item={value} index={index} inView={inView} />
        ))}
      </div>
    </div>
  );
}

function MvvCard({ tag, heading, body }: { tag: string; heading: string; body: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`border p-10 transition-all duration-400 ${
        hovered
          ? "border-[rgba(201,168,76,0.35)] bg-[#111111] shadow-[0_0_40px_rgba(201,168,76,0.07)]"
          : "border-[rgba(201,168,76,0.12)] bg-[#0D0D0D]"
      }`}
    >
      <div className="mb-4 font-['Raleway',sans-serif] text-[0.65rem] uppercase tracking-[0.35em] text-[#C9A84C]">
        {tag}
      </div>
      <h3 className="mb-5 font-['Cinzel',serif] text-[1.25rem] leading-[1.25] tracking-[0.04em] text-[#F5EDD6] whitespace-pre-line">
        {heading}
      </h3>
      <p className="font-['Raleway',sans-serif] text-[0.92rem] leading-[1.8] text-[#9A8C6A]">
        {body}
      </p>
    </div>
  );
}

function ValueCard({
  item,
  index,
  inView,
}: {
  item: ValueItem;
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden border p-8 transition-all duration-400 ${
        hovered
          ? "border-[rgba(201,168,76,0.35)] shadow-[0_0_30px_rgba(201,168,76,0.06)]"
          : "border-[rgba(201,168,76,0.1)]"
      } ${inView ? "translate-y-0 opacity-100" : "translate-y-[20px] opacity-0"}`}
      style={{ transitionDelay: inView ? `${0.2 + index * 0.08}s` : "0s" }}
    >
      <div className={`absolute inset-x-0 top-0 h-[2px] transition-all duration-400 ${hovered ? "bg-[linear-gradient(to_right,transparent,#C9A84C,transparent)]" : "bg-transparent"}`} />
      <div className={`mb-5 transition-colors duration-400 ${hovered ? "text-[#F0C04A]" : "text-[#C9A84C]"}`}>
        {item.icon}
      </div>
      <div className="mb-3 font-['Cinzel',serif] text-[0.95rem] tracking-[0.06em] text-[#F5EDD6]">
        {item.title}
      </div>
      <p className="font-['Raleway',sans-serif] text-[0.84rem] leading-[1.7] text-[#9A8C6A]">
        {item.body}
      </p>
    </div>
  );
}
