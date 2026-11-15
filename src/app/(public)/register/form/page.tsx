import { eventModel } from "@/back-end/models/event-model";
import RegistrationFormClient from "./RegistrationFormClient";

export const dynamic = "force-dynamic";

export default async function RegistrationFormPage() {
  const activeEvent = await eventModel.findFirstId();
  const activeEventId = activeEvent?.id ?? "";

  return <RegistrationFormClient defaultEventId={activeEventId} />;
}