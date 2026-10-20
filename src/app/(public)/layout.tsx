import "../globals.css";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { cinzel, raleway, playfair } from "@/app/fonts";
import { getEventStatus } from "@/back-end/lib/utils/get-event-status";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The EliteGlam",
  description: "A premier beauty and talent competition that celebrates diversity, inclusivity, and empowerment.",
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const eventStatus = await getEventStatus();

  return (
    <html lang="en" className={`${cinzel.variable} ${raleway.variable} ${playfair.variable}`}>
      <body>
        <Header eventStatus={eventStatus} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
