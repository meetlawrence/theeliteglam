"use client";

import { BANNER_IMG, BANNER_VIDEO } from "./aboutData";

type AboutHeroSectionProps = {
  bannerImage: string;
  inView: boolean;
};

export function AboutHeroSection({ bannerImage, inView }: AboutHeroSectionProps) {
  return (
    <section className="relative flex h-[88vh] min-h-[560px] items-end overflow-hidden">
      {/* Video Background */}
        <div className="absolute inset-0">
        <img src={bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={bannerImage}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
            <source src={BANNER_VIDEO} type="video/webm" />
            Your browser does not support the video tag.
        </video>
        </div>
      <div className="absolute inset-0 bg-[rgba(8,8,8,0.52)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,8,1)_0%,rgba(8,8,8,0.35)_45%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_65%,rgba(201,168,76,0.09)_0%,transparent_70%)]" />

      <div
        className={`relative mx-auto w-full max-w-[1300px] px-8 pb-22 transition-all duration-[1200ms] ${
          inView ? "translate-y-0 opacity-100" : "translate-y-[30px] opacity-0"
        }`}
      >
        <div className="mb-4 flex items-center gap-3 font-['Raleway',sans-serif] text-[0.68rem] tracking-[0.5em] uppercase text-[#C9A84C]">
          <span className="inline-block h-px w-8 bg-[#C9A84C]" />
          Our Story
        </div>
        <h1 className="mb-5 max-w-[720px] font-['Cinzel',serif] text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.05] tracking-[0.06em] text-[#F5EDD6]">
          About{" "}
          <span className="bg-[linear-gradient(135deg,#C9A84C,#F0C04A)] bg-clip-text text-transparent">
            The Elite Glam
          </span>
        </h1>
        <p className="max-w-[500px] font-['Playfair_Display',serif] text-[1.1rem] italic leading-[1.7] text-[#9A8C6A]">
          A movement born in Lagos. A vision forged in gold. A legacy that is only just beginning.
        </p>
      </div>
    </section>
  );
}
