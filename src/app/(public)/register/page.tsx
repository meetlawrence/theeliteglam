import { RegisterSection } from "@/app/components/register/RegisterSection";
import { fetchEventStatus, fetchServerApi } from "@/app/lib/server-api";
import { notFound } from "next/navigation";

type FirstEventResponse = {
  success?: boolean;
  data?: { id: string };
  message?: string;
};

export default async function RegisterPage() {
  const eventStatus = await fetchEventStatus();

  if (!eventStatus.isRegistrationOpen) {
    notFound();
  }

  let eventId: string;
  try {
    const response = await fetchServerApi("/api/event/get-first-event");
    const result: FirstEventResponse = await response.json();

    if (!response.ok || result.success !== true || !result.data?.id) {
      throw new Error(result.message || "Unable to load the registration event.");
    }

    eventId = result.data.id;
  } catch (error) {
    return (
      <main className="min-h-screen bg-[#080808] px-6 flex items-center justify-center text-center text-[#F5EDD6]">
        <p>
          {error instanceof Error
            ? error.message
            : "Unable to load the registration event. Please try again later."}
        </p>
      </main>
    );
  }

  return <RegisterSection eventId={eventId} />;
}