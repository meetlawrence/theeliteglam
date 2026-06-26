"use client";

import React, { useState } from "react";

export default function SponsorCard({ sponsor, index, inView }: { sponsor: { name: string; desc: string; logo: string }; index: number; inView: boolean; }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#131313" : "#0D0D0D",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.1)"}`,
        padding: "2rem",
        transition: "all 0.4s ease",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transitionDelay: inView ? `${0.5 + index * 0.07}s` : "0s",
        cursor: "default",
        boxShadow: hovered ? "0 0 30px rgba(201,168,76,0.06)" : "none",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          background: hovered
            ? "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))"
            : "rgba(201,168,76,0.07)",
          border: `1px solid ${hovered ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.13)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.25rem",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.7rem",
          color: "#C9A84C",
          letterSpacing: "0.04em",
          transition: "all 0.4s ease",
        }}
      >
        {sponsor.logo}
      </div>

      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.95rem",
          color: "#F5EDD6",
          letterSpacing: "0.04em",
          marginBottom: "0.6rem",
          lineHeight: 1.3,
        }}
      >
        {sponsor.name}
      </div>
      <p
        style={{
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.84rem",
          color: "#9A8C6A",
          lineHeight: 1.65,
        }}
      >
        {sponsor.desc}
      </p>
    </div>
  );
}
