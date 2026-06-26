"use client";

import { HeroSection } from "../components/Hero"; 
import { SearchBeginsSection } from "../components/SearchBegins";
import { OverviewSection } from "../components/FranchiseOverview";

export default function HomePage() {
  const handleNavigate = (page: string) => {
    console.log(`Navigating to: ${page}`);
  };

  return (
    <main>
      <HeroSection onNavigate={handleNavigate} />
      <SearchBeginsSection />
      <OverviewSection />
    </main>
  );
}