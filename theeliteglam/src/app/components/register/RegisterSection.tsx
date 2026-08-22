"use client";

import { RegisterBanner } from "./RegisterBanner";
import { EligibilitySection } from "./EligibilitySection";
import { ProcessSection } from "./ProcessSection";
import { RegistrationSection as RegistrationContent } from "./RegistrationSection";

export function RegisterSection() {
  return (
    <div className="bg-[#080808] min-h-screen text-[#F5EDD6]">
      <RegisterBanner />

      <EligibilitySection />

      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mx-8" />

      <ProcessSection />

      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mx-8" />

      <RegistrationContent />
    </div>
  );
}
