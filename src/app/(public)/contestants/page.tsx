import { ContestantsPageSection } from "@/app/components/contestant/ContestantsPageSection";
import type { EventStatus } from "@/back-end/types/event-types";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Contestants - The EliteGlam",
  description: "Meet the contestants of The EliteGlam Pageant.",
};

export default async function ContestantsPage() {
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

  if (!data.data.isVotingOpen) {
    notFound();
  }
  
  return (
    <main>
      <ContestantsPageSection />
    </main>
  );
}
