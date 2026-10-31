import Payment from "@/app/components/payment/page";
import type { EventStatus } from "@/back-end/types/event-types";
import { notFound } from "next/navigation";

export default async function TicketsPage() {
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
  return <Payment />;
}
