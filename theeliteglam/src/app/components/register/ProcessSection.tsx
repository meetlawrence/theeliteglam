"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS } from "./constants";
import { SectionLabel } from "./SectionLabel";

interface ProcessStep {
  step: string;
  label: string;
  desc: string;
}

function ProcessCard({ step, label, desc }: ProcessStep) {
  return (
    <div 
      role="listitem" 
      className="group relative lg:px-6 text-left lg:text-center transition-transform duration-500 hover:-translate-y-1"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#C9A84C]/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 -z-10" />

      <div className="w-12 h-12 lg:mx-auto mb-6 rounded-full bg-[#14120E] border border-[#C9A84C]/30 shadow-[0_0_20px_rgba(201,168,76,0.05)] flex items-center justify-center font-['Cinzel',serif] text-[0.78rem] text-[#C9A84C] tracking-[0.12em] relative z-10 transition-all duration-500 group-hover:border-[#C9A84C] group-hover:shadow-[0_0_25px_rgba(201,168,76,0.2)] group-hover:scale-105">
        {step}
      </div>

      <h3 className="font-['Cinzel',serif] text-[0.98rem] text-[#F5EDD6] tracking-[0.04em] mb-3 transition-colors duration-300 group-hover:text-[#C9A84C]">
        {label}
      </h3>
      
      <p className="font-['Raleway',sans-serif] text-[0.84rem] text-[#9A8C6A] leading-[1.8] font-light">
        {desc}
      </p>
    </div>
  );
}

export function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const headerVisibility = inView 
    ? "translate-y-0 opacity-100" 
    : "translate-y-6 opacity-0";

  const gridVisibility = inView 
    ? "translate-y-0 opacity-100" 
    : "translate-y-10 opacity-0";

  return (
    <section ref={ref} className="max-w-[1300px] mx-auto py-32 px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#C9A84C]/[0.02] blur-[120px] pointer-events-none rounded-full" />

      {/* Section Header */}
      <div className={`transition-all duration-1000 ease-out ${headerVisibility}`}>
        <SectionLabel text="The Journey" />
        <h2 className="font-['Cinzel',serif] text-[clamp(2rem,4vw,2.8rem)] text-[#F5EDD6] tracking-[0.06em] leading-[1.1] mt-3 mb-16">
          How It Works
        </h2>
        <p className="font-['Raleway',sans-serif] text-[0.88rem] text-[#9A8C6A] leading-[1.75] max-w-[700px] mb-20">
          The application process is designed to be simple and straightforward. Follow the steps below to complete your application and join the elite community of The Elite Glam.
        </p>
    
        <div 
          role="list"
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 relative transition-all duration-1000 delay-300 ease-out ${gridVisibility}`}
        >

          <div 
            aria-hidden="true" 
            className="hidden lg:block absolute top-[24px] left-[14%] right-[14%] h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" 
          />
          
          {PROCESS.map((item) => (
            <ProcessCard key={item.step} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}