import { redirect } from "next/navigation";
import { HeroSection } from "../components/Hero";
import { SearchBeginsSection } from "../components/SearchBegins";
import { OverviewSection } from "../components/FranchiseOverview";
import { fetchEventStatus } from "@/app/lib/server-api";

export default async function HomePage() {
  const eventStatus = await fetchEventStatus();

  async function handleNavigate(page: "tickets" | "register" | "contestants") {
    "use server";
    redirect(`/${page}`);
  }

  return (
    <main>
      <HeroSection onNavigate={handleNavigate} eventStatus={eventStatus} />
      <SearchBeginsSection eventStatus={eventStatus} />
      <OverviewSection />
    </main>
  );
}