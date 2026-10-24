import { redirect } from "next/navigation";
import { EventsBanner } from "../../components/events/EventsBanner";
import { EventsHeadline } from "../../components/events/EventsHeadline";
import { EventsGallery } from "../../components/events/EventsGallery";
import { EventsExperience } from "../../components/events/EventsExperience";
import { EventsItinerary } from "../../components/events/EventsItinerary";
import { fetchEventStatus } from "@/app/lib/server-api";

export default async function EventsPage() {
  const eventStatus = await fetchEventStatus();
  
    async function handleNavigate(page: "tickets" | "register" | "contestants") {
      "use server";
      redirect(`/${page}`);
    }

  return (
      <main>
        <EventsBanner onNavigate={handleNavigate} eventStatus={eventStatus}  />
        <EventsHeadline />
        <EventsGallery />
        <EventsExperience />
        <EventsItinerary />
      </main>
    );
}
