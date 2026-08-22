"use client";

import CTA from "./ui/CTA";
import { Ticket, UserPlus, Star } from "lucide-react";
import { HOME_IMAGES } from "./homeData";

export function HeroSection({
  onNavigate,
}: {
  onNavigate: (page: "tickets" | "register" | "contestants") => void;
}) {
  const handleNavigate = (page: "tickets" | "register" | "contestants") => {
    onNavigate(page);
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black pt-19.5">
      <div className="absolute inset-0 opacity-35">
        <img src={HOME_IMAGES.heroBackgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HOME_IMAGES.heroBackgroundImage}
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src={HOME_IMAGES.heroBackgroundVideo} type="video/webm" />
        </video>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(201,168,76,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/95" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-225 px-6 text-center">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center justify-center gap-4 text-[0.7rem] uppercase tracking-[0.5em] text-primary font-raleway opacity-0 animate-[fadeInUp_1s_ease-out_forwards] lg:text-[0.8rem] lg:tracking-[0.55em]">
          <span className="h-px w-10 bg-linear-to-r from-transparent to-primary" />
          Season 2
          <span className="h-px w-10 bg-linear-to-l from-transparent to-primary" />
        </div>        

        <h1 className="mt-6 mb-4 font-cinzel text-[clamp(2rem,4vw,3.4rem)] uppercase tracking-[0.3em] text-[#F5EDD6] opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards] lg:text-[clamp(2.6rem,5vw,4.2rem)] lg:tracking-[0.35em]">
          The Elite Glam
        </h1>

        <p className="my-6 font-playfair italic text-lg text-muted-foreground leading-relaxed opacity-0 animate-[fadeInUp_1s_ease-out_0.45s_forwards]">
          Where Beauty Meets Purpose
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
          <CTA icon={<Ticket size={16} />} label="Get Tickets" variant="primary" onClick={() => handleNavigate("tickets")} />
          <CTA icon={<UserPlus size={16} />} label="Register Now" variant="ghost" onClick={() => handleNavigate("register")} />
          <CTA icon={<Star size={16} />} label="Vote Now" variant="accent" onClick={() => handleNavigate("contestants")} />
        </div>

        <div className="mx-auto mt-12 flex flex-col items-center opacity-0 animate-[fadeInUp_1s_ease-out_0.75s_forwards]">
          <span className="mb-2 text-[0.7rem] uppercase tracking-[0.35em] text-[#F5EDD6]/70">
            Scroll
          </span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[#F5EDD6]/40">
            <span className="mt-2 h-3 w-1.5 rounded-full bg-[#F5EDD6] animate-[pulse_2.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}
