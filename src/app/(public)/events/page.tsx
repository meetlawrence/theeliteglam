import { redirect } from "next/navigation";
import { EventsBanner } from "../../components/events/EventsBanner";
import { EventsHeadline } from "../../components/events/EventsHeadline";
import { EventsGallery } from "../../components/events/EventsGallery";
import { EventsExperience } from "../../components/events/EventsExperience";
import { EventsItinerary } from "../../components/events/EventsItinerary";
import type { EventItem } from "../../components/events/types";
import { getEventStatus } from "@/back-end/lib/utils/get-event-status";
import { prisma } from "@/back-end/db/db-connect";
import type { DayItinerary } from "../../components/events/types";

function isScheduleItem(value: unknown): value is { time: string; title: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "time" in value &&
    typeof value.time === "string" &&
    "title" in value &&
    typeof value.title === "string"
  );
}

async function getItineraryData(): Promise<{
  title: string | null;
  days: DayItinerary[];
}> {
  try {
    const event = await prisma.event.findFirst({
      select: {
        itineraryTitle: true,
        itineraryDays: {
          orderBy: {
            date: "asc",
          },
        },
      },
    });

    const days = event?.itineraryDays.map((day) => {
      const schedule = Array.isArray(day.schedule) ? day.schedule : [];
      const events: EventItem[] = schedule.flatMap((item, index) => {
        if (!isScheduleItem(item)) {
          console.error(`Invalid itinerary schedule item for day ${day.id}.`);
          return [];
        }

        return [{ id: `${day.id}-${index}`, name: item.title, time: item.time }];
      });

      return {
        id: day.id,
        day: `Day ${String(day.dayNumber).padStart(2, "0")}`,
        date: day.date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        }),
        title: day.title,
        events,
      };
    }) ?? [];

    return { title: event?.itineraryTitle ?? null, days };
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return { title: null, days: [] };
  }
}

export default async function EventsPage() {
  const eventStatus = await getEventStatus();
  const itinerary = await getItineraryData();

  async function handleNavigate(page: "tickets" | "register" | "contestants") {
    "use server";
    redirect(`/${page}`);
  }

  return (
    <main>
      <EventsBanner onNavigate={handleNavigate} eventStatus={eventStatus} />
      <EventsHeadline />
      <EventsGallery />
      <EventsExperience />
      <EventsItinerary initialData={itinerary.days} title={itinerary.title} />
    </main>
  );
}