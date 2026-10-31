"use client";

import CTA from "./ui/CTA";
import { Ticket, UserPlus, Star } from "lucide-react";
import { HOME_IMAGES } from "./homeData";

interface HeroSectionProps {
  onNavigate: (page: "tickets" | "register" | "contestants") => void;
  eventStatus?: {
    isRegistrationOpen: boolean;
    isTicketsOpen: boolean;
    isVotingOpen: boolean;
  };
}

export function HeroSection({ onNavigate, eventStatus }: HeroSectionProps) {
  const handleNavigate = (page: "tickets" | "register" | "contestants") => {
    onNavigate(page);
  };

  const isTicketsOpen = eventStatus ? eventStatus.isTicketsOpen : false;
  const isRegistrationOpen = eventStatus ? eventStatus.isRegistrationOpen : false;
  const isVotingOpen = eventStatus ? eventStatus.isVotingOpen : false;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black pt-19.5">
      <div className="absolute inset-0 opacity-30">
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
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/95" />

      <div className="relative z-10 w-full max-w-225 px-6 text-center">
        <div className="mb-8 flex items-center justify-center gap-4 text-[0.7rem] uppercase tracking-[0.5em] text-primary font-raleway opacity-0 animate-[fadeInUp_1s_ease-out_forwards] lg:text-[0.8rem] lg:tracking-[0.55em]">
          <span className="h-px w-10 bg-linear-to-r from-transparent to-primary" />
          Season 2
          <span className="h-px w-10 bg-linear-to-l from-transparent to-primary" />
        </div>        

        <h1 className="mt-6 mb-4 flex flex-col items-center font-cinzel uppercase tracking-[0.3em] text-[#F5EDD6] opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards] leading-[1.1]">
          <span className="text-[clamp(1rem,2vw,1.4rem)] tracking-[0.5em] text-[#9A8C6A] font-light">The</span>
          <span className="text-[clamp(2.2rem,5vw,4rem)] font-bold text-[#F0C04A] drop-shadow-[0_0_25px_rgba(201,168,76,0.2)] my-1">
            EliteGlam
          </span>
          <span className="text-[clamp(1.4rem,3vw,2.2rem)] tracking-[0.4em] text-[#F5EDD6] font-medium">
            Pageant
          </span>
        </h1>

        <p className="my-6 font-playfair italic text-lg text-muted-foreground leading-relaxed opacity-0 animate-[fadeInUp_1s_ease-out_0.45s_forwards]">
          Where Beauty Meets Purpose
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
          {isTicketsOpen && (
            <CTA icon={<Ticket size={16} />} label="Get Tickets" variant="primary" onClick={() => handleNavigate("tickets")} />
          )}
          {isRegistrationOpen && (
            <CTA icon={<UserPlus size={16} />} label="Register Now" variant="ghost" onClick={() => handleNavigate("register")} />
          )}
          {isVotingOpen && (
            <CTA icon={<Star size={16} />} label="Vote Now" variant="accent" onClick={() => handleNavigate("contestants")} />
          )}
        </div>
      </div>
    </section>
  );
}