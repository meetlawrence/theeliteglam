import { ContestantsPageSection } from "@/app/components/contestant/ContestantsPageSection";
import { notFound } from "next/navigation";
import { getCachedEventStatus } from "@/app/lib/event-status";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contestants - The EliteGlam",
  description: "Meet the contestants of The EliteGlam Pageant.",
};

export default async function ContestantsPage() {
  const eventStatus = await getCachedEventStatus();

  if (!eventStatus.isVotingOpen) {
    notFound();
  }
  
  return (
    <main>
      <ContestantsPageSection />
    </main>
  );
}
