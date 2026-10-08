"use client";

import React, { useState } from "react";

export default function BrandLogoCard({
  item,
  index,
  inView,
}: {
  item: { brand: string; desc: string; image: string };
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col items-center justify-center text-center overflow-hidden cursor-default transition-all duration-500 ease-out aspect-square w-full"
      style={{
        border: `1px solid ${hovered ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.12)"}`,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transitionDelay: inView ? `${0.2 + index * 0.07}s` : "0s",
        boxShadow: hovered ? "0 0 40px rgba(201,168,76,0.12)" : "none",
        background: "#0D0D0D",
        padding: "2rem 1rem",
        borderRadius: "5%",
      }}
    >
      {/* 
      */}
      <div
        className="absolute inset-0 z-0 transition-all duration-500 ease-out"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          filter: hovered ? "brightness(0.3) blur(7px)" : "brightness(1) blur(0px)",
          transform: hovered ? "scale(1.03)" : "scale(1)",
        }}
      />

      {/* 

      */}
      <div 
        className="relative z-10 pointer-events-none transition-opacity duration-500 ease-out"
        style={{
          opacity: hovered ? 1 : 0, 
        }}
      >
        <span className="font-['Cinzel',serif] text-[0.7rem] tracking-[0.2em] text-[#C9A84C] uppercase drop-shadow-lg">
          {item.brand}
        </span>
        {item.desc && (
          <p className="mt-2 font-['Raleway',sans-serif] text-[0.75rem] text-[#9A8C6A] leading-[1.4] transition-colors duration-300 group-hover:text-[#B5A582]">
            {item.desc}
          </p>
        )}
      </div>
    </div>
  );
}