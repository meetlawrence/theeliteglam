"use client";

import { RegisterBanner } from "./RegisterBanner";
import { EligibilitySection } from "./EligibilitySection";
import { ProcessSection } from "./ProcessSection";
import {  RegistrationContent } from "./RegistrationContent";
import { Divider } from "../ui/SectionDivider";

export function RegisterSection({ eventId }: { eventId: string }) {
  return (
    <div className="bg-[#080808] min-h-screen text-[#F5EDD6]">
      <RegisterBanner />

      <EligibilitySection />

      <Divider />

      <ProcessSection />

      <Divider />
      
      <RegistrationContent eventId={eventId} />
    </div>
  );
}
