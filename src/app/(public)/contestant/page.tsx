import { ContestantsPageSection } from "@/app/components/contestant/ContestantsPageSection";
import { fetchEventStatus } from "@/app/lib/server-api";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Contestants - The EliteGlam",
  description: "Meet the contestants of The EliteGlam Pageant.",
};

export default async function ContestantsPage() {
  const eventStatus = await fetchEventStatus();
  
    // If the event status is not available, you can choose to render a fallback UI or handle it as needed. For example, you might want to show a "Coming Soon" page or a message indicating that the event status is currently unavailable.
    if (!eventStatus || !eventStatus.isVotingOpen) {
      notFound(); 
    }
  
  return (
    <main>
      <ContestantsPageSection />
    </main>
  );
}
