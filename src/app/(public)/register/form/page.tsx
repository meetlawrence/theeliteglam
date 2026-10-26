"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApplicationForm } from "@/app/components/register/ApplicationForm";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

type RegistrationAccessState = "loading" | "allowed" | "denied" | "error";

function RegistrationFormContent() {
  const searchParams = useSearchParams();
  const reference = (
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    ""
  ).trim();
  const [access, setAccess] = useState<{
    reference: string;
    state: RegistrationAccessState;
    errorTitle: string;
    errorMessage: string;
  }>({
    reference: "",
    state: "loading",
    errorTitle: "Access Restricted",
    errorMessage: "",
  });
  const accessState: RegistrationAccessState = !reference
    ? "denied"
    : access.reference === reference
      ? access.state
      : "loading";
  const errorTitle = reference
    ? access.errorTitle
    : "Missing Reference";
  const errorMessage = reference
    ? access.errorMessage
    : "No payment reference was provided in your request. Please return to the registration page to initiate your entry.";

  useEffect(() => {
    if (!reference) return;

    const controller = new AbortController();

    async function checkRegistrationAccess() {
      try {
        const response = await fetch(
          `/api/contestants/registration-status?reference=${encodeURIComponent(reference)}`,
          {
            method: "GET",
          },
        );
        const result: {
          success?: boolean;
          eligible?: boolean;
          message?: string;
        } = await response.json();

        if (!response.ok) {
          setAccess({
            reference,
            state: response.status >= 500 ? "error" : "denied",
            errorTitle:
              response.status === 404
                ? "Unverified Reference"
                : response.status === 409
                  ? "Reference Already Used"
                  : response.status === 403
                    ? "Unverified Reference"
                    : "Unable to Verify Reference",
            errorMessage:
              result.message || "We could not verify your payment reference.",
          });
          return;
        }

        if (result.success !== true || result.eligible !== true) {
          throw new Error("The registration status response was invalid.");
        }

        setAccess({
          reference,
          state: "allowed",
          errorTitle: "Access Restricted",
          errorMessage: "",
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Failed to verify contestant registration access:", error);
        setAccess({
          reference,
          state: "error",
          errorTitle: "System Error",
          errorMessage:
            error instanceof Error
              ? error.message
              : "We could not verify your payment reference. Please try again.",
        });
      }
    }

    void checkRegistrationAccess();
    return () => controller.abort();
  }, [reference]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] flex items-center justify-center p-6">
      {accessState === "allowed" ? (
        <ApplicationForm reference={reference} />
      ) : (
        <div className="max-w-[520px] w-full bg-[#121212] border border-[#C9A84C]/20 p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

          {accessState === "loading" ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center">
                <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
              </div>
              <h1 className="font-['Cinzel',serif] text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#F5EDD6] tracking-[0.04em] mb-4">
                Verifying Payment
              </h1>
              <p className="font-['Raleway',sans-serif] text-[0.85rem] text-[#9A8C6A] leading-[1.7]">
                Please wait while we verify your registration access.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C96B5D]/10 border border-[#C96B5D]/30 flex items-center justify-center shadow-[0_0_30px_rgba(201,107,93,0.15)]">
                <ShieldAlert size={28} className="text-[#C96B5D]" />
              </div>

              <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.35em] text-[#C96B5D] uppercase mb-2">
                Application Locked
              </div>

              <h1 className="font-['Cinzel',serif] text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#F5EDD6] tracking-[0.04em] mb-4">
                {errorTitle}
              </h1>

              <p className="font-['Raleway',sans-serif] text-[0.85rem] text-[#9A8C6A] leading-[1.7] mb-8">
                {errorMessage}
              </p>

              <div className="pt-6 border-t border-[#C9A84C]/10 flex flex-col gap-3">
                <Link
                  href="/register"
                  className="w-full py-3.5 px-6 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-[#080808] font-['Cinzel',serif] text-[0.75rem] uppercase font-bold flex items-center justify-center gap-2 transition-all hover:brightness-110"
                >
                  <ArrowLeft size={14} />
                  Return to Registration
                </Link>

                <a
                  href="mailto:support@theeliteglam.com"
                  className="font-['Raleway',sans-serif] text-[0.72rem] text-[#5A5040] hover:text-[#9A8C6A] transition-colors"
                >
                  Need assistance? Contact support@theeliteglam.com
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}

export default function ContestantsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] flex items-center justify-center p-6">
          <div className="max-w-[520px] w-full bg-[#121212] border border-[#C9A84C]/20 p-10 text-center font-['Raleway',sans-serif] text-sm text-[#9A8C6A]">
            Loading registration details...
          </div>
        </main>
      }
    >
      <RegistrationFormContent />
    </Suspense>
  );
}
