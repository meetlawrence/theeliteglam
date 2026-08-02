"use client";

import { useRouter } from "next/navigation";
import { HeroSection } from "../components/Hero";
import { SearchBeginsSection } from "../components/SearchBegins";
import { OverviewSection } from "../components/FranchiseOverview";

export default function HomePage() {
  const router = useRouter();

  const handleNavigate = (page: "tickets" | "register" | "contestants") => {
    const routes: Record<"tickets" | "register" | "contestants", string> = {
      tickets: "/tickets",
      register: "/register",
      contestants: "/contestants",
    };

    router.push(routes[page]);
  };

  return (
    <main>
      <HeroSection onNavigate={handleNavigate} />
      <SearchBeginsSection />
      <OverviewSection />
    </main>
  );
}
