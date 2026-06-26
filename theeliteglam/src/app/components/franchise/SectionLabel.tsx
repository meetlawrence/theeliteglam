import React from "react";

export default function SectionLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        fontFamily: "'Raleway', sans-serif",
        fontSize: "0.68rem",
        letterSpacing: "0.45em",
        color: "#C9A84C",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: "32px",
          height: "1px",
          background: "#C9A84C",
          display: "inline-block",
        }}
      />
      {text}
    </div>
  );
}
