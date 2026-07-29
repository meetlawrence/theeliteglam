// src/app/payment/verify/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type VerificationState = "loading" | "success" | "failed" | "error";

export default function VerifyPayment() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<VerificationState>("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [ticketInfo, setTicketInfo] = useState<any>(null);

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`../../api/ticket/verify-payment?reference=${reference}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage("Payment verified successfully!");
          setTicketInfo(data);
        } else {
          setStatus("failed");
          setMessage(data.error || "Payment verification failed.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("Something went wrong while verifying your payment.");
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Loading */}
        {status === "loading" && (
          <>
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h1>
            <p className="text-gray-600">{message}</p>
            <p className="mt-4 text-sm text-gray-400">
              Reference: {reference}
            </p>
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Your ticket has been sent to your email.
            </p>

            {reference && (
              <p className="text-sm text-gray-500 mb-6">
                Reference: <span className="font-mono">{reference}</span>
              </p>
            )}

            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 transition"
              >
                Back to Home
              </Link>
              <button
                onClick={() => router.push("/tickets")}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                View My Tickets
              </button>
            </div>
          </>
        )}

        {/* Failed / Error */}
        {(status === "failed" || status === "error") && (
          <>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {status === "failed" ? "Payment Failed" : "Verification Error"}
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>

            {reference && (
              <p className="text-sm text-gray-500 mb-6">
                Reference: <span className="font-mono">{reference}</span>
              </p>
            )}

            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 transition"
              >
                Back to Home
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}