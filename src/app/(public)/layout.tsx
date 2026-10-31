import "../globals.css";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import type { EventStatus } from "@/back-end/types/event-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The EliteGlam",
  description: "A premier beauty and talent competition that celebrates diversity, inclusivity, and empowerment.",
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <>
      <Header eventStatus={data.data} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
