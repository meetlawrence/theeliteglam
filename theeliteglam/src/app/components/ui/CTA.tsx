"use client";

import { ReactNode, useState } from "react";

export default function CTA({ icon, label, variant, onClick }: { icon: ReactNode; label: string; variant: "primary" | "ghost" | "accent"; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const base = "flex items-center gap-2 px-6 py-3 font-cinzel text-[0.78rem] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer";
  const primary = "bg-primary text-black";
  const accent = "border border-accent text-accent bg-transparent";
  const ghost = "border border-primary/50 text-primary bg-transparent";

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`${base} ${variant === "primary" ? primary : variant === "accent" ? accent : ghost} ${hovered ? "-translate-y-0.5 shadow-[0_8px_30px_rgba(201,168,76,0.12)]" : ""}`}
    >
      {icon}
      {label}
    </button>
  );
}
