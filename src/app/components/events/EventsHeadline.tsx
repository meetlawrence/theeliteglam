"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionLabel from "./SectionLabel";

export default function EventsHeadline() {
  const [inView, setInView] = useState(false);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
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
      ref={headlineRef}
      className={`mx-auto px-8 py-28 grid lg:grid-cols-[1fr_1fr] gap-20 items-center transition-all duration-1000 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}`}
    >
      <div className="">
        <SectionLabel text="Headline Event" />
        <h2 className="font-cinzel text-[clamp(1.8rem,4vw,3.2rem)] text-[#F5EDD6] tracking-[0.06em] leading-[1.1] mt-6 mb-6">
          The Return of
          <br />
          <span className="bg-[linear-gradient(135deg,#C9A84C,#F0C04A)] bg-clip-text text-transparent block">
            The Elite Glam
          </span>
        </h2>
        <p className="font-raleway text-[0.97rem] text-muted-foreground leading-[1.85] mb-5">
          Following a successful inaugural edition, The EliteGlam returns bigger, bolder, and more
          prestigious than ever.
        </p>
        <p className="font-raleway text-[0.97rem] text-muted-foreground leading-[1.85] mb-10">
          Season II brings together outstanding contestants from across Nigeria and around the world
          to compete for the nation’s most coveted crowns.
        </p>
        <div className="flex flex-wrap gap-12">
          {[
            { value: "Lagos", label: "Location" },
            { value: "May 2027", label: "Grand Finale" },
            { value: "₦2M Each", label: "Worth of Prizes" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-cinzel text-[1.3rem] text-accent tracking-wider">{value}</div>
              <div className="font-raleway text-[0.68rem] tracking-[0.25em] uppercase text-muted-foreground mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-105">
        <div className="absolute top-5 right-5 bottom-0 left-0 border border-border bg-[#0D0D0D]" />
        <div className="absolute top-0 right-10 bottom-5 left-0">
          <Image
            src="/events/dinner/x.jpg"
            alt="Stage event highlight"
            fill
            className="object-cover "
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_60%,rgba(8,8,8,0.7)_100%)]" />
        <div className="absolute bottom-6 right-12 font-cinzel text-[0.65rem] tracking-[0.3em] text-primary uppercase bg-[rgba(8,8,8,0.8)] px-3 py-1 border border-border">
          Season II · 2027
        </div>
      </div>
    </section>
  );
}
