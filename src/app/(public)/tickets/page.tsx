import Payment from "@/app/components/payment/page";
import { fetchEventStatus } from "@/app/lib/server-api";
import { notFound } from "next/navigation";

export default async function TicketsPage() {
  const eventStatus = await fetchEventStatus();

  if (!eventStatus || !eventStatus.isVotingOpen) {
    notFound();
  }
  return <Payment />;
}