import { redirect } from "next/navigation";
import { HeroSection } from "../components/Hero";
import { SearchBeginsSection } from "../components/SearchBegins";
import { OverviewSection } from "../components/FranchiseOverview";
import { getEventStatus } from "@/back-end/lib/utils/get-event-status";

export default async function HomePage() {
  const eventStatus = await getEventStatus();

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