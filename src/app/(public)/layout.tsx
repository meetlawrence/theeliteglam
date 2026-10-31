import "../globals.css";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { fetchEventStatus } from "@/app/lib/server-api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The EliteGlam",
  description: "A premier beauty and talent competition that celebrates diversity, inclusivity, and empowerment.",
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const eventStatus = await fetchEventStatus();

  return (
    <>
      <Header eventStatus={eventStatus} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
