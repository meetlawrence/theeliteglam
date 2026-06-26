"use client";

import EventsBanner from "../../components/events/EventsBanner";
import EventsHeadline from "../../components/events/EventsHeadline";
import EventsGallery from "../../components/events/EventsGallery";
import EventsExperience from "../../components/events/EventsExperience";
import EventsItinerary from "../../components/events/EventsItinerary";

export default function EventsPage({ onNavigate }: { onNavigate: (page: "tickets" | "register" | "contestants") => void }) {
  return (
    <main>
      <EventsBanner onNavigate={onNavigate} />
      <EventsHeadline />
      <EventsGallery />
      <EventsExperience />
      <EventsItinerary />
    </main>
  );
}
