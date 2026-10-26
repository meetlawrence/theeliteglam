import "../globals.css";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { cinzel, raleway, playfair } from "@/app/fonts";
import { fetchEventStatus } from "@/app/lib/server-api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The EliteGlam",
  description: "A premier beauty and talent competition that celebrates diversity, inclusivity, and empowerment.",
};

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const eventStatus = await fetchEventStatus();

  return (
    <html lang="en" className={`${cinzel.variable} ${raleway.variable} ${playfair.variable}`}suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header eventStatus={eventStatus} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
