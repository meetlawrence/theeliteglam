"use client";

import React, { useState } from "react";

export default function BrandLogoCard({
  item,
  index,
  inView,
}: {
  item: { brand: string; initials: string; image: string };
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        border: `1px solid ${hovered ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.12)"}`,
        padding: "2.5rem 1.5rem",
        transition: "all 0.4s ease",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transitionDelay: inView ? `${0.2 + index * 0.07}s` : "0s",
        cursor: "default",
        boxShadow: hovered ? "0 0 40px rgba(201,168,76,0.10)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        textAlign: "center",
        overflow: "hidden",
        minHeight: "260px",
        background: "#0D0D0D",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${item.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: hovered ? 0.55 : 0.38,
          transition: "opacity 0.5s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.55) 60%, rgba(13,13,13,0.4) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "64px",
          height: "64px",
          border: `1px solid ${hovered ? "rgba(201,168,76,0.55)" : "rgba(201,168,76,0.22)"}`,
          background: hovered
            ? "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06))"
            : "rgba(13,13,13,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.75rem",
          color: hovered ? "#F0C04A" : "#C9A84C",
          letterSpacing: "0.06em",
          transition: "all 0.4s ease",
          backdropFilter: "blur(4px)",
        }}
      >
        {item.initials}
      </div>

      <div
        style={{
          position: "relative",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.82rem",
          color: hovered ? "#F5EDD6" : "#C4B896",
          letterSpacing: "0.08em",
          lineHeight: 1.4,
          transition: "color 0.4s ease",
        }}
      >
        {item.brand}
      </div>
    </div>
  );
}
