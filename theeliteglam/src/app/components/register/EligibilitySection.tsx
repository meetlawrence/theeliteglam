"use client";

import { useEffect, useRef, useState } from "react";
import { ELIGIBILITY } from "./constants";
import { SectionLabel } from "./SectionLabel";

export function EligibilitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="max-w-[1300px] mx-auto px-8 pt-28 pb-20">
      <div className={`transition-all duration-1000 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <SectionLabel text="Who Can Apply" />
        <h2 className="font-['Cinzel',serif] text-[clamp(1.8rem,3.5vw,2.6rem)] text-[#F5EDD6] tracking-[0.05em] leading-[1.1] mt-4 mb-12">
        Eligibility Criteria
      </h2>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-200 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
        {ELIGIBILITY.map(({ n, title, body }) => (
          <div key={n} className="bg-[#0D0D0D] border border-[#C9A84C]/10 p-8 relative overflow-hidden">
            <div className="absolute -top-2.5 right-4 font-['Cinzel',serif] text-[5rem] text-[#C9A84C]/[0.05] leading-none select-none">
              {n}
            </div>
            <div className="font-['Cinzel',serif] text-[0.95rem] text-[#C9A84C] tracking-[0.06em] mb-3">
              {title}
            </div>
            <p className="font-['Raleway',sans-serif] text-[0.88rem] text-[#9A8C6A] leading-[1.75]">
              {body}
            </p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
