"use client";

import { useEffect, useRef, useState } from "react";
import { AboutFaqSection } from "./AboutFaqSection";
import { AboutHeroSection } from "./AboutHeroSection";
import { AboutLeadershipSection } from "./AboutLeadershipSection";
import { AboutMaidenEditionSection } from "./AboutMaidenEditionSection";
import { AboutMissionValuesSection } from "./AboutMissionValuesSection";
import { AboutWinnersSection } from "./AboutWinnersSection";
import { Divider } from "./AboutShared";
import { BANNER_IMG, CEO_IMG, FAQS, MAIDEN_IMGS, MISSION_VISION_CARDS, RUNNERS_UP, VALUES, WINNERS } from "./aboutData";

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.03 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-[#080808]">
      <AboutHeroSection bannerImage={BANNER_IMG} inView={inView} />

      <AboutMissionValuesSection missionVisionCards={MISSION_VISION_CARDS} values={VALUES} inView={inView} />

      <Divider />

      <AboutLeadershipSection image={CEO_IMG} />

      <Divider />

      <AboutMaidenEditionSection images={MAIDEN_IMGS} />

      <Divider />

      <AboutWinnersSection winners={WINNERS} runnersUp={RUNNERS_UP} />

      <Divider />

      <AboutFaqSection faqs={FAQS} />
    </div>
  );
}
