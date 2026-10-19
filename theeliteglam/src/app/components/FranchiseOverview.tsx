"use client";

import { useState, useEffect, useRef } from "react";
import SectionLabel from "./franchise/SectionLabel";
import BrandLogoCard from "./franchise/BrandLogoCard";
import SponsorButton from "./franchise/SponsorButton";
import { ENDORSEMENTS, SPONSORS } from "./franchise/franchiseData";
import { HOME_IMAGES } from "./homeData";

export function OverviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0A0A0A] px-8 py-28 lg:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: `url(${HOME_IMAGES.franchiseBackground})` }}
      />

      <div className="relative mx-auto max-w-[1300px]">
        {/* Endorsements Section */}
        <div
          className={`mb-28 transition-all duration-1000 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-[30px] opacity-0"
          }`}
        >
          <SectionLabel text="Endorsements" />
          <h2 className="mt-4 mb-8 font-['Cinzel',serif] text-[clamp(1.6rem,3.5vw,2.8rem)] tracking-[0.06em] text-[#F5EDD6]">
            International Franchise
          </h2>

          {/* Main Grid Wrapper */}
          <div className="mt-10 mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
            
            {/* Female Franchises Column / Top Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="font-raleway text-[0.68rem] tracking-[0.25em] text-[#C9A84C] uppercase  bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                  Female 
                </span>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center justify-center">
                {ENDORSEMENTS.filter((e) => e.gender === "female").map((e, i) => (
                  <BrandLogoCard key={e.brand} item={e} index={i} inView={inView} />
                ))}
              </div>
            </div>

            {/* Male Franchises Column / Bottom Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="font-raleway text-[0.68rem] tracking-[0.25em] text-[#C9A84C] uppercase  bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">
                  Male
                </span>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center justify-center">
                {ENDORSEMENTS.filter((e) => e.gender === "male").map((e, i) => (
                  <BrandLogoCard key={e.brand} item={e} index={i} inView={inView} />
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mb-24 h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.3),transparent)]" />

        {/* Sponsors Carousel Section */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-[30px] opacity-0"
          }`}
        >
          <SectionLabel text="Our Sponsors" />
          <h2 className="mt-4 mb-3 font-['Cinzel',serif] text-[clamp(1.6rem,3.5vw,2.8rem)] tracking-[0.06em] text-[#F5EDD6]">
            Sponsors & Partners
          </h2>

          <div className="mt-10 mb-12 grid gap-6 grid-cols-2 lg:grid-cols-5 items-center justify-center">
            {SPONSORS.map((e, i) => (
              <BrandLogoCard key={e.brand} item={e} index={i} inView={inView} />
            ))}
          </div>
          
          <div className="mt-16 grid items-center gap-8 rounded-[1px] border border-[rgba(201,168,76,0.2)] bg-[#0D0D0D] p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <div className="mb-2 font-['Raleway',sans-serif] text-[0.7rem] uppercase tracking-[0.35em] text-[#C9A84C]">
                Partnership Opportunities
              </div>
              <h3 className="mb-2 font-['Cinzel',serif] text-[1.4rem] text-[#F5EDD6]">
                Become a Sponsor
              </h3>
              <p className="max-w-[480px] font-['Raleway',sans-serif] text-[0.9rem] leading-[1.6] text-[#9A8C6A]">
                Align your brand with elegance, reach a global audience of 4M+, and support a
                movement that empowers people worldwide.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <p className="font-['Raleway',sans-serif] text-[0.9rem] leading-[1.6] text-[#9A8C6A]">
                For sponsorship inquiries, please reach out to us at{" "}
                <a
                  href="mailto:info@theeliteglam.com"
                  className="text-[#C9A84C] hover:text-[#D4AF37] underline"
                >
                  info@theeliteglam.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}