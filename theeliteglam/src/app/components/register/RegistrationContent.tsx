"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { ApplicationForm } from "./ApplicationForm";
import { FormField } from "./FormField";

interface RegistrationContentProps {
  eventId: string;
}

export function RegistrationContent({ eventId }: RegistrationContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [paid, setPaid] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [inView, setInView] = useState(false);
  const paymentVerificationInProgress = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsSubmitting(false);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("application") !== "contestant") return;

    const reference = searchParams.get("reference");
    if (!reference) return;

    let isActive = true;
    paymentVerificationInProgress.current = true;

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `/api/contestants/verify-payment?reference=${encodeURIComponent(reference)}`,
          { cache: "no-store" },
        );
        const result: { success?: boolean; error?: string } = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Payment verification failed.");
        }

        if (isActive) {
          setPaymentReference(reference);
          setPaid(true);
        }
      } catch (err) {
        if (isActive) {
          setPaymentError(
            err instanceof Error
              ? err.message
              : "Unable to verify your payment. Please try again.",
          );
        }
      } finally {
        if (isActive) paymentVerificationInProgress.current = false;
      }
    };

    void verifyPayment();
    return () => {
      isActive = false;
    };
  }, []);

  const handlePay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contestants/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const result: {
        success?: boolean;
        message?: string;
        error?: string;
        data?: { authorizationUrl?: string; authorization_url?: string };
      } = await response.json();

      const authUrl = result.data?.authorizationUrl || result.data?.authorization_url;

      if (!response.ok || !result.success || !authUrl) {
        throw new Error(result.error || result.message || "Unable to initialize payment.");
      }

      window.location.assign(authUrl);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to initialize payment. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div id="apply" ref={ref} className="max-w-[760px] mx-auto pt-24 pb-32 px-8">
      {paid ? (
        <ApplicationForm reference={paymentReference} />
      ) : (
        <div className={`transition-all duration-1000 ease-out ${inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <SectionLabel text="Registration" />
          <h2 className="font-['Cinzel',serif] text-[clamp(1.8rem,3.5vw,2.6rem)] text-[#F5EDD6] tracking-[0.05em] leading-[1.1] mt-4 mb-3">
            Begin Your Application
          </h2>
          <p className="font-['Playfair_Display',serif] text-[0.98rem] text-[#9A8C6A] italic leading-[1.75] mb-12">
            A non-refundable registration fee of ₦25,000 is required to access the application form. This helps us maintain the quality and integrity of the selection process.
          </p>

          {!showPayment ? (
            <div className="bg-[#0D0D0D] border border-[#C9A84C]/[0.18] p-10 mb-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.35em] text-[#9A8C6A] uppercase mb-1.5">
                    Registration Fee
                  </div>
                  <div className="font-['Cinzel',serif] text-[2.4rem] text-[#F0C04A] tracking-[0.04em] leading-none">
                    ₦25,000
                  </div>
                  <div className="font-['Raleway',sans-serif] text-[0.65rem] text-[#5A5040] tracking-[0.15em] uppercase mt-1.2">
                    one-time · non-refundable
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-[#C9A84C]/10 mb-8" />

              <div className="flex flex-col gap-3 mb-10">
                {[
                  "Access to the official Season 2 application form",
                  "Profile review by The Elite Glam selection panel",
                  "Invitation to virtual auditions if shortlisted",
                  "Exclusive applicant newsletter and updates",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check size={13} className="text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="font-['Raleway',sans-serif] text-[0.88rem] text-[#9A8C6A] leading-[1.55]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {paymentError && (
                <p role="alert" className="font-['Raleway',sans-serif] text-[0.78rem] text-[#C96B5D] mb-4">
                  {paymentError}
                </p>
              )}

              <button
                onClick={() => {
                  if (paymentVerificationInProgress.current) return;
                  setPaymentError("");
                  setShowPayment(true);
                }}
                className="w-full py-4.5 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] border-none text-[#080808] font-['Cinzel',serif] text-[0.82rem] tracking-[0.22em] uppercase cursor-pointer flex items-center justify-center gap-2.5 transition-opacity hover:opacity-95"
              >
                Begin Application
              </button>
            </div>
          ) : (
            <div className="bg-[#0D0D0D] border border-[#C9A84C]/[0.28] p-10 mb-6 transition-all duration-500">
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 text-[#9A8C6A] hover:text-[#F5EDD6] text-xs uppercase tracking-widest mb-6 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to details
              </button>

              <form onSubmit={handlePay}>
                <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.4em] text-[#C9A84C] uppercase mb-2">
                  Secure Checkout
                </div>
                <h3 className="font-['Cinzel',serif] text-[1.35rem] text-[#F5EDD6] tracking-[0.04em] mb-4">
                  Enter Your Information
                </h3>

                <div className="flex flex-col gap-4">
                  <FormField
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={setName}
                    required
                    placeholder="Amaka Adeyinka"
                  />
                  <FormField
                    label="Email "
                    type="email"
                    value={email}
                    onChange={setEmail}
                    required
                    placeholder="you@email.com"
                  />
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    required
                    placeholder="+234 801 234 5678"
                  />

                  {error && (
                    <p role="alert" className="font-['Raleway',sans-serif] text-[0.78rem] text-[#C96B5D]">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full py-4.5 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] border-none text-[#080808] font-['Cinzel',serif] text-[0.82rem] tracking-[0.22em] uppercase cursor-pointer flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmitting ? "Connecting to Paystack..." : "Proceed to Pay ₦25,000"}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-5 text-[#5A5040] text-[0.68rem] font-['Raleway',sans-serif]">
                  <ShieldCheck size={13} className="text-[#C9A84C]" />
                  You will be securely redirected to Paystack
                </div>
              </form>
            </div>
          )}

          <p className="text-center font-['Raleway',sans-serif] text-[0.72rem] text-[#5A5040] leading-[1.6]">
            Applications are subject to review and acceptance is not guaranteed.
          </p>
        </div>
      )}
    </div>
  );
}