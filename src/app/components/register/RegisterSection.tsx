"use client";

import { useEffect, useState } from "react";
import { RegisterBanner } from "./RegisterBanner";
import { EligibilitySection } from "./EligibilitySection";
import { ProcessSection } from "./ProcessSection";
import { RegistrationContent } from "./RegistrationContent";
import { Divider } from "../ui/SectionDivider";

interface FirstEventResponse {
  success?: boolean;
  data?: {
    id?: string;
  };
  message?: string;
}

export function RegisterSection() {
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventError, setEventError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchRegistrationEvent = async () => {
      try {
        const res = await fetch("/api/event/get-first-event", {
          method: "GET",
          cache: "no-store",
        });
        const data: FirstEventResponse = await res.json();

        if (!res.ok || !data.success || !data.data?.id) {
          throw new Error(data.message ?? "Failed to fetch registration data.");
        }

        if (isActive) {
          setEventId(data.data.id);
        }
      } catch (error) {
        if (isActive) {
          setEventError(
            error instanceof Error
              ? error.message
              : "Failed to fetch registration data.",
          );
        }
      }
    };

    void fetchRegistrationEvent();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="bg-[#080808] min-h-screen text-[#F5EDD6]">
      <RegisterBanner />

      <EligibilitySection />

      <Divider />

      <ProcessSection />

      <Divider />

      {eventId ? (
        <RegistrationContent eventId={eventId} />
      ) : (
        <div
          id="apply"
          className="max-w-[760px] mx-auto pt-24 pb-32 px-8 text-center"
          role={eventError ? "alert" : "status"}
        >
          {eventError || "Loading registration details..."}
        </div>
      )}
    </div>
  );
}
