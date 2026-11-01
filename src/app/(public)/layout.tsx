import "../globals.css";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The EliteGlam",
  description: "A premier beauty and talent competition that celebrates diversity, inclusivity, and empowerment.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
