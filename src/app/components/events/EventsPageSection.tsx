"use client";

import {EventsBanner} from "./EventsBanner";
import {EventsHeadline} from "./EventsHeadline";
import {EventsGallery} from "./EventsGallery";
import {EventsExperience} from "./EventsExperience";
import {EventsItinerary} from "./EventsItinerary";

type EventsPageSectionProps = {
  onNavigate?: (page: "tickets" | "register" | "contestants") => void;
};

export function EventsPageSection({ onNavigate }: EventsPageSectionProps) {
  return (
    <main>
      <EventsBanner onNavigate={onNavigate ?? (() => undefined)} />
      <EventsHeadline />
      <EventsGallery />
      <EventsExperience />
      <EventsItinerary />
    </main>
  );
}
