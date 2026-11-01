import { RegisterSection } from "@/app/components/register/RegisterSection";
import { notFound } from "next/navigation";
import { getCachedEventStatus } from "@/app/lib/event-status";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const eventStatus = await getCachedEventStatus();

  if (!eventStatus.isRegistrationOpen) {
    notFound();
  }

  return <RegisterSection />;
}
