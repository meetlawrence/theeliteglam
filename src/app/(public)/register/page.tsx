"use client";

import { useEffect, useState } from "react";
import { RegisterSection } from "@/app/components/register/RegisterSection";

type FirstEventResponse = {
  success?: boolean;
  data?: { id: string };
  error?: string;
};

export default function RegisterPage() {
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFirstEvent() {
      try {
        const response = await fetch("/api/event/get-first-event", {
          signal: controller.signal,
          cache: "no-store",
        });
        const result: FirstEventResponse = await response.json();

        if (!response.ok || result.success !== true || !result.data?.id) {
          throw new Error(result.error || "Unable to load the registration event.");
        }

        setEventId(result.data.id);
      } catch (error) {
        if (controller.signal.aborted) return;
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load the registration event. Please try again later.",
        );
      }
    }

    void loadFirstEvent();
    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-[#080808] px-6 flex items-center justify-center text-center text-[#F5EDD6]">
        <p>{error}</p>
      </main>
    );
  }

  if (!eventId) {
    return (
      <main className="min-h-screen bg-[#080808] px-6 flex items-center justify-center text-center text-[#F5EDD6]">
        <p>Loading registration event...</p>
      </main>
    );
  }

  return <RegisterSection eventId={eventId} />;
}