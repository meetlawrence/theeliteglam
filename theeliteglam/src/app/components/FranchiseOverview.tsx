"use client";

import { useState, useEffect, useRef } from "react";
import SectionLabel from "./franchise/SectionLabel";
import BrandLogoCard from "./franchise/BrandLogoCard";
import SponsorButton from "./franchise/SponsorButton";
import PartnerModal from "./franchise/PartnerModal";
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
          <h2 className="mt-4 mb-3 font-['Cinzel',serif] text-[clamp(1.6rem,3.5vw,2.8rem)] tracking-[0.06em] text-[#F5EDD6]">
            International Franchise
          </h2>
          <div className="mt-10 mb-12 grid gap-6 grid-cols-2 lg:grid-cols-5 items-center justify-center">
            {ENDORSEMENTS.map((e, i) => (
              <BrandLogoCard key={e.brand} item={e} index={i} inView={inView} />
            ))}
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
            <SponsorButton onOpen={() => setModalOpen(true)} />
          </div>
        </div>
      </div>

      {modalOpen && <PartnerModal onClose={() => setModalOpen(false)} />}
    </section>
  );
}