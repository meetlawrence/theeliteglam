"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ItineraryRow({
  ev,
  index,
  isLast,
}: {
  ev: { time: string; name: string };
  index: number;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`grid items-center gap-4 py-4 grid-cols-1 lg:grid-cols-[120px_1fr_auto] lg:py-6 border-b ${isLast ? "border-transparent" : "border-[rgba(201,168,76,0.08)]"} ${hovered ? "bg-[rgba(201,168,76,0.03)]" : "bg-transparent"}`}
    >
      <div className="font-raleway text-[0.72rem] tracking-[0.18em] text-[#C9A84C] uppercase">
        {ev.time}
      </div>
      <div className={`font-cinzel text-[0.9rem] ${hovered ? "text-[#F5EDD6]" : "text-[#C4B896]"}`}>
        {ev.name}
      </div>
    </div>
  );
}
