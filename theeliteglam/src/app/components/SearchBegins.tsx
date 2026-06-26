"use client";

import { useState, useEffect, useRef } from "react";
import TimelineCard from "./TimelineCard";
import ApplyButton from "./ApplyButton";

type TimelineStep = {
  date: string;
  title: string;
  desc: string;
  icon: string;
  tag?: string | null;
};

const TIMELINE: TimelineStep[] = [
  { date: "October 1, 2026", title: "Registration Opens", desc: "Contestants submit their profiles, portfolios, and personal statements.", icon: "01", tag: null },
  { date: "January 1, 2027", title: "Auditions", desc: "Auditions open to contestants across the globe. Showcase your talent, poise, and personality from anywhere.", icon: "02", tag: "Held Virtually" },
  { date: "May 28, 2027", title: "Preliminary", desc: "Qualified contestants compete in talent, evening wear, and interview rounds.", icon: "03", tag: null },
  { date: "May 30, 2027", title: "Grand Finale", desc: "One stage. Two crowns. A lifetime of opportunities.", icon: "04", tag: "Main Event" },
];

const STATS = [{ label: "Prize Pool · 2 Winners", value: "₦2M Each", icon: "★" }];

export function SearchBeginsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden bg-black py-28 px-8">
      <div className="pointer-events-none absolute right-[-10%] top-[10%] w-125 h-125 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.06)_0%,transparent_70%)]" />
      <div className="absolute left-[5%] top-[10%] bottom-[10%] w-px bg-[linear-gradient(to_bottom,transparent,rgba(201,168,76,0.3),transparent)]" />

      <div className="max-w-325 mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="font-raleway text-[0.7rem] tracking-[0.5em] text-[#C9A84C] uppercase mb-4">2026 · 2027 Season</div>
          <h2 className="font-cinzel text-[clamp(2rem,5vw,4rem)] text-[#F5EDD6] tracking-[0.08em] mb-4 leading-[1.1]">The Search Begins</h2>
          <p className="font-playfair text-[1.15rem] italic text-muted-foreground max-w-145 mx-auto leading-[1.7]">
            Open to all — male and female. We are seeking the next icons of grace, intelligence, and beauty. Your moment to shine starts here.
          </p>
        </div>

        <div className={`grid grid-cols-1 gap-px bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.15)] mb-20 transition-all duration-1000 delay-200 ${inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-black p-8 text-center">
              <div className="text-[#C9A84C] mb-2 flex justify-center text-[1.2rem]">{stat.icon}</div>
              <div className="font-cinzel text-[2rem] text-accent tracking-wider leading-none">{stat.value}</div>
              <div className="font-raleway text-[0.72rem] text-muted-foreground tracking-[0.2em] uppercase mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-0.5 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {TIMELINE.map((step, i) => (
            <TimelineCard key={step.title} step={step} index={i} inView={inView} />
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-600 ${inView ? "opacity-100" : "opacity-0"}`}>
          <ApplyButton />
        </div>
      </div>
    </section>
  );
}
