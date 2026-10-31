import { RegisterSection } from "@/app/components/register/RegisterSection";
import type { EventStatus } from "@/back-end/types/event-types";
import { notFound } from "next/navigation";

export default async function RegisterPage() {
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

  if (!data.data.isRegistrationOpen) {
    notFound();
  }

  return <RegisterSection />;
}
