"use client";

import Image from "next/image";
import { Ticket, UserPlus, Star } from "lucide-react";
import { ParticleCanvas } from "./ui/ParticlesCanvas";
import CTA from "./ui/CTA";

export function HeroSection({ onNavigate }: { onNavigate: (page: "tickets" | "register" | "contestants") => void }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black pt-[78px]">
      
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 bg-[url('/banners/img1.webp')] bg-cover bg-center opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(201,168,76,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/95" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-225 px-6 text-center transition-all duration-1000 ease-out translate-y-0 opacity-100">
        {/* Eyebrow */}
        <div className="mb-8 flex items-center justify-center gap-4 text-[0.7rem] uppercase tracking-[0.5em] text-primary font-raleway">
          <span className="h-[1px] w-10 bg-linear-to-r from-transparent to-primary" />
          Season II · Now Open
          <span className="h-[1px] w-10 bg-linear-to-l from-transparent to-primary" />
        </div>

        {/* Logo & Text */}
        <div className="mx-auto logo-swell inline-block">
          <Image 
            src="/logo.svg" 
            alt="Crown" 
            width={400} 
            height={400} 
            className="mx-auto h-[clamp(80px,14vw,140px)] animate-breathe mix-blend-screen drop-shadow-[0_0_24px_rgba(201,168,76,0.55)] px-10" 
            />
        </div>
        <Image src="/wordmark.svg" alt="Elite Glam"  width={100} height={100} className="mx-auto w-[clamp(280px,55vw,580px)] mix-blend-screen drop-shadow-[0_0_16px_rgba(201,168,76,10.35)]" />

        <p className="my-12 font-playfair italic text-lg text-muted-foreground leading-relaxed">
          Where Beauty Meets Purpose
        </p>
        

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <CTA icon={<Ticket size={16} />} label="Get Tickets" variant="primary" onClick={() => onNavigate("tickets")} />
          <CTA icon={<UserPlus size={16} />} label="Register Now" variant="ghost" onClick={() => onNavigate("register")} />
          <CTA icon={<Star size={16} />} label="Vote Now" variant="accent" onClick={() => onNavigate("contestants")} />
        </div>
      </div>
      
      {/* Particle Animation */}
      <ParticleCanvas />
    </section>
  );
}

