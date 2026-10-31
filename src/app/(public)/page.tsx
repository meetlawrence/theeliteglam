import { redirect } from "next/navigation";
import { HeroSection } from "../components/Hero";
import { SearchBeginsSection } from "../components/SearchBegins";
import { OverviewSection } from "../components/FranchiseOverview";
import type { EventStatus } from "@/back-end/types/event-types";

export default async function HomePage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/event/status`,
    {
      method: "GET",
    },
  );
  const data: {
    success: boolean;
    data?: EventStatus;
    message?: string;
  } = await res.json();

  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.message ?? "Unable to fetch /api/event/status.");
  }

  async function handleNavigate(page: "tickets" | "register" | "contestants") {
    "use server";
    redirect(`/${page}`);
  }

  return (
    <main>
      <HeroSection onNavigate={handleNavigate} eventStatus={data.data} />
      <SearchBeginsSection eventStatus={data.data} />
      <OverviewSection />
    </main>
  );
}
