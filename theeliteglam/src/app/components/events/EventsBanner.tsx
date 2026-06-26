"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Ticket, UserPlus, Star } from "lucide-react";
import EventCTA from "../ui/CTA";

interface EventsBannerProps {
  onNavigate: (page: "tickets" | "register" | "contestants") => void;
}

export default function EventsBanner({ onNavigate }: EventsBannerProps) {
  const [inView, setInView] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bannerRef.current;
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
    <section ref={bannerRef} className="bg-[#080808]">
      <div className="relative h-[92vh] min-h-[580px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src="/banners/event.webm" type="video/webm" />
            <source src="/banners/event.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute inset-0 bg-[rgba(8,8,8,0.55)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,1)_0%,rgba(8,8,8,0.4)_40%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(201,168,76,0.1)_0%,transparent_70%)]" />

        <div
          className={`relative w-full max-w-[1300px] mx-auto px-8 pb-20 transition-all duration-[1200ms] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}`}
        >
          <div className="flex items-center gap-3 text-[0.68rem] tracking-[0.5em] uppercase text-primary mb-4">
            <span className="inline-block w-8 h-px bg-primary" />
            Season 2026 · 2027
          </div>
          <h1 className="font-cinzel text-[clamp(2.2rem,6vw,5rem)] text-[#F5EDD6] tracking-[0.06em] leading-[1.05] mb-6 max-w-[800px]">
            The Elite Glam<br />
            <span className="bg-[linear-gradient(135deg,#C9A84C,#F0C04A)] bg-clip-text text-transparent block">
              Events
            </span>
          </h1>
          <p className="font-playfair text-[1.1rem] text-[#9A8C6A] italic mb-10 max-w-[520px] leading-[1.7]">
            Mark your calendars. The stage is set, the lights are rising — glory awaits.
          </p>
          <div className="flex flex-wrap gap-4">
            <EventCTA icon={<Ticket size={15} />} label="Get Tickets" variant="primary" onClick={() => onNavigate("tickets")} />
            <EventCTA icon={<UserPlus size={15} />} label="Register Now" variant="ghost" onClick={() => onNavigate("register")} />
            <EventCTA icon={<Star size={15} />} label="Vote Now" variant="accent" onClick={() => onNavigate("contestants")} />
          </div>
        </div>
      </div>
    </section>
  );
}
