// src/app/payment/verify/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";

type VerificationState = "loading" | "success" | "failed" | "error";

function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const [status, setStatus] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("Verifying your payment transaction...");
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage(
        "No payment reference was provided in your request. Please return to registration.",
      );
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payment/verify?reference=${encodeURIComponent(reference)}`, {
          method: "GET",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          setTicketInfo(data);
        } else {
          setStatus("failed");
          setMessage(
            data.message ||
              data.error ||
              "We could not verify a successful payment for this transaction reference.",
          );
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Something went wrong while communicating with the server.");
      }
    };

    verifyPayment();
  }, [reference, router]);

  return (
    <div className="max-w-[520px] w-full bg-[#121212] border border-[#C9A84C]/20 p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      {/* Loading State */}
      {status === "loading" && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.15)]">
            <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
          </div>
          <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.35em] text-[#C9A84C] uppercase mb-2">
            Secure Verification
          </div>
          <h1 className="font-['Cinzel',serif] text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#F5EDD6] tracking-[0.04em] mb-4">
            Verifying Payment
          </h1>
          <p className="font-['Raleway',sans-serif] text-[0.85rem] text-[#9A8C6A] leading-[1.7] mb-6">
            {message}
          </p>
          {reference && (
            <div className="font-['Raleway',sans-serif] text-[0.7rem] text-[#5A5040] tracking-wider uppercase">
              Ref: <span className="text-[#9A8C6A] font-mono">{reference}</span>
            </div>
          )}
        </>
      )}

      {/* Success State */}
      {status === "success" && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center shadow-[0_0_30px_rgba(201,168,76,0.15)]">
            <Check size={28} className="text-[#F0C04A]" />
          </div>
          <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.35em] text-[#C9A84C] uppercase mb-2">
            Payment Confirmed
          </div>
          <h1 className="font-['Cinzel',serif] text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#F5EDD6] tracking-[0.04em] mb-4">
            Access Unlocked
          </h1>
          <p className="font-['Raleway',sans-serif] text-[0.85rem] text-[#9A8C6A] leading-[1.7] mb-8">
            Your payment has been successfully verified. Redirecting you to your contestant
            application form...
          </p>
          {reference && (
            <div className="font-['Raleway',sans-serif] text-[0.7rem] text-[#5A5040] tracking-wider uppercase mb-6">
              Ref: <span className="text-[#9A8C6A] font-mono">{reference}</span>
            </div>
          )}
          <Link
            href={`/register/form?reference=${reference}`}
            className="w-full py-3.5 px-6 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-[#080808] font-['Cinzel',serif] text-[0.75rem] uppercase font-bold flex items-center justify-center gap-2 transition-all hover:brightness-110"
          >
            Proceed to Application Form
          </Link>
        </>
      )}

      {/* Failed / Error State */}
      {(status === "failed" || status === "error") && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C96B5D]/10 border border-[#C96B5D]/30 flex items-center justify-center shadow-[0_0_30px_rgba(201,107,93,0.15)]">
            <ShieldAlert size={28} className="text-[#C96B5D]" />
          </div>
          <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.35em] text-[#C96B5D] uppercase mb-2">
            Verification Failed
          </div>
          <h1 className="font-['Cinzel',serif] text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#F5EDD6] tracking-[0.04em] mb-4">
            {status === "failed" ? "Payment Unverified" : "System Error"}
          </h1>
          <p className="font-['Raleway',sans-serif] text-[0.85rem] text-[#9A8C6A] leading-[1.7] mb-8">
            {message}
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
  );
}

export default function VerifyPaymentPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] flex items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="max-w-[520px] w-full bg-[#121212] border border-[#C9A84C]/20 p-10 text-center font-['Raleway',sans-serif] text-sm text-[#9A8C6A]">
            Loading verification details...
          </div>
        }
      >
        <VerifyPaymentContent />
      </Suspense>
    </main>
  );
}
