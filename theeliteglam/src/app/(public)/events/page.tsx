"use client";

import { useRouter } from "next/navigation";
import { EventsPageSection } from "@/app/components/events/EventsPageSection";

export default function EventsPage() {
  const router = useRouter();

  const handleNavigate = (page: "tickets" | "register" | "contestants") => {
    const routes: Record<"tickets" | "register" | "contestants", string> = {
      tickets: "/tickets",
      register: "/register",
      contestants: "/contestants",
    };

    router.push(routes[page]);
  };

  return <EventsPageSection onNavigate={handleNavigate} />;
}
