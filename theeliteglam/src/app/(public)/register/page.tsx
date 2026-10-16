import { prisma } from "@/back-end/db/db-connect";
import { RegisterSection } from "@/app/components/register/RegisterSection";

export default async function RegisterPage() {
  const event = await prisma.event.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  const eventId = event?.id ?? "default-event-id";

  return <RegisterSection eventId={eventId} />;
}