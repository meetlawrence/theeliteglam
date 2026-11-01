import Payment from "@/app/components/payment/page";
import { notFound } from "next/navigation";
import { getCachedEventStatus } from "@/app/lib/event-status";

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const eventStatus = await getCachedEventStatus();

  if (!eventStatus.isVotingOpen) {
    notFound();
  }
  return <Payment />;
}
