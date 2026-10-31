import { redirect } from "next/navigation";
import { EventsBanner } from "../../components/events/EventsBanner";
import { EventsHeadline } from "../../components/events/EventsHeadline";
import { EventsGallery } from "../../components/events/EventsGallery";
import { EventsExperience } from "../../components/events/EventsExperience";
import { EventsItinerary } from "../../components/events/EventsItinerary";
import type { EventStatus } from "@/back-end/types/event-types";

export default async function EventsPage() {
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
  
    async function handleNavigate(page: "tickets" | "register" | "contestants") {
      "use server";
      redirect(`/${page}`);
    }

  return (
      <main>
        <EventsBanner onNavigate={handleNavigate} eventStatus={data.data}  />
        <EventsHeadline />
        <EventsGallery />
        <EventsExperience />
        <EventsItinerary />
      </main>
    );
}
