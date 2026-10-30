import { ContestantsPageSection } from "@/app/components/contestant/ContestantsPageSection";
import { fetchEventStatus } from "@/app/lib/server-api";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Contestants - The EliteGlam",
  description: "Meet the contestants of The EliteGlam Pageant.",
};

export default async function ContestantsPage() {
  const eventStatus = await fetchEventStatus();
  
    if (!eventStatus || !eventStatus.isVotingOpen) {
      notFound(); 
    }
  
  return (
    <main>
      <ContestantsPageSection />
    </main>
  );
}
