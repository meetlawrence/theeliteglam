"use client";

import { useEffect, useRef, useState } from "react";
import SectionLabel from "./SectionLabel";
import NigeriaPillarCard from "./NigeriaPillarCard";
import { NIGERIA_PILLARS } from "./eventsData";

export default function EventsExperience() {
  const [inView, setInView] = useState(false);
  const experienceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = experienceRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.03 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={experienceRef}
      className={`px-8 py-28 max-w-[1300px] mx-auto transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}`}
    >
      <SectionLabel text="Experience Nigeria" />
      <h2 className="font-cinzel text-[clamp(1.8rem,4vw,3rem)] text-[#F5EDD6] tracking-[0.06em] mt-4 mb-3 leading-[1.15]">
        Where Culture Meets the Crown
      </h2>
      <p className="font-playfair text-base text-[#9A8C6A] italic max-w-[560px] leading-[1.75] mb-16">
        Nigeria is more than our host nation—it is the heartbeat of The EliteGlam Pageant. Every
        stage, every contestant, and every crown reflects the rich culture, diversity, and
        excellence that define our nation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 nigeria-grid">
        {NIGERIA_PILLARS.map((pillar, i) => (
          <NigeriaPillarCard key={pillar.heading} pillar={pillar} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}
