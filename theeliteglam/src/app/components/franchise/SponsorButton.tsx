"use client";

import React, { useState } from "react";

export default function SponsorButton({ onOpen }: { onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      style={{
        whiteSpace: "nowrap",
        background: hovered ? "rgba(201,168,76,0.07)" : "transparent",
        border: "1px solid #C9A84C",
        color: hovered ? "#F0C04A" : "#C9A84C",
        fontFamily: "'Cinzel', serif",
        fontSize: "0.75rem",
        letterSpacing: "0.18em",
        padding: "0.85rem 2rem",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textTransform: "uppercase",
      }}
    >
      Partner With Us
    </button>
  );
}
