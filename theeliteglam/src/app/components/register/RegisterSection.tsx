"use client";

import { RegisterBanner } from "./RegisterBanner";
import { EligibilitySection } from "./EligibilitySection";
import { ProcessSection } from "./ProcessSection";
import { RegistrationSection as RegistrationContent } from "./RegistrationSection";
import { Divider } from "../ui/SectionDivider";

export function RegisterSection() {
  return (
    <div className="bg-[#080808] min-h-screen text-[#F5EDD6]">
      <RegisterBanner />

      <EligibilitySection />

      <Divider />

      <ProcessSection />

      <Divider />
      
      <RegistrationContent />
    </div>
  );
}
