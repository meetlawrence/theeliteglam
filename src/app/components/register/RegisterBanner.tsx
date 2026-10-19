"use client";

import { useEffect, useRef, useState } from "react";
import { BANNER_IMG, BANNER_VIDEO } from "./constants";

export function RegisterBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-[82vh] min-h-[520px] flex items-end overflow-hidden">
      <div className="absolute inset-0">
          <img src={BANNER_IMG} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={BANNER_IMG}
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src={BANNER_VIDEO} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      {/* <div className="absolute inset-0 bg-[#080808]/60" /> */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/25 to-transparent" />

      <div className={`relative w-full max-w-325 mx-auto px-8 pb-22 transition-all duration-1000 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <div className="font-['Raleway',sans-serif] text-[0.68rem] tracking-[0.5em] text-[#C9A84C] uppercase mb-4 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-[#C9A84C] inline-block" />
          Season 2 · Applications Open
        </div>
        <h1 className="font-['Cinzel',serif] text-[clamp(2.4rem,6vw,5rem)] text-[#F5EDD6] tracking-[0.06em] leading-[1.05] mb-5 max-w-[700px]">
          Apply for{" "}
          <span className="bg-gradient-to-br from-[#C9A84C] to-[#F0C04A] bg-clip-text text-transparent">
            The Elite Glam
          </span>
        </h1>
        <p className="font-['Playfair_Display',serif] text-[1.1rem] text-[#9A8C6A] italic max-w-[500px] leading-[1.7]">
          One application. A lifetime of possibility. This is where your story changes.
        </p>
      </div>
    </div>
  );
}
