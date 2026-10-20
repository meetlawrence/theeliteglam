"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function FranchiseButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        background: hovered
          ? "linear-gradient(135deg, #F0C04A, #C9A84C)"
          : "linear-gradient(135deg, #C9A84C, #8B6914)",
        border: "none",
        color: "#080808",
        fontFamily: "'Cinzel', serif",
        fontSize: "0.78rem",
        letterSpacing: "0.18em",
        padding: "0.85rem 2rem",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textTransform: "uppercase",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 30px rgba(201,168,76,0.35)" : "none",
      }}
    >
      Franchise Inquiry
      <ChevronRight size={14} />
    </button>
  );
}
