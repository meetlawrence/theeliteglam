import { Suspense } from "react";
import { VerifyEmailSection } from "@/app/(public)/payment/VerifyEmailSection";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailSection />
    </Suspense>
  );
}