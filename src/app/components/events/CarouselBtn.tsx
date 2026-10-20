"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarouselBtn({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 ${dir === "left" ? "left-8" : "right-8"} -translate-y-1/2 w-12 h-12 flex items-center justify-center backdrop-blur-md z-10 transition-all duration-300 bg-[rgba(8,8,8,0.7)] border border-[rgba(201,168,76,0.25)]`}
    >
      {dir === "left" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
    </button>
  );
}
