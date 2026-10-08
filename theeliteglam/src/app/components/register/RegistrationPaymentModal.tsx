"use client";

import { useState, type FormEvent } from "react";
import { Lock, ShieldCheck, X } from "lucide-react";
import { FormField } from "./FormField";

export function RegistrationPaymentModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contestants/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });
      const result: {
        success?: boolean;
        error?: string;
        data?: { authorization_url?: string };
      } = await response.json();

      if (!response.ok || !result.success || !result.data?.authorization_url) {
        throw new Error(result.error || "Unable to initialize payment.");
      }

      window.location.assign(result.data.authorization_url);
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
    <div
      onClick={isSubmitting ? undefined : onClose}
      className="fixed inset-0 z-50 bg-black/88 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-[#0E0E0E] border border-[#C9A84C]/25 shadow-[0_0_100px_rgba(201,168,76,0.1)] max-w-[460px] w-full max-h-[92vh] overflow-y-auto relative p-10"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close payment dialog"
          className="absolute top-4 right-4 bg-[#C9A84C]/[0.08] border border-[#C9A84C]/20 text-[#C9A84C] cursor-pointer w-8 h-8 flex items-center justify-center disabled:cursor-not-allowed"
        >
          <X size={16} />
        </button>

        <form onSubmit={handlePay}>
          <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.4em] text-[#C9A84C] uppercase mb-2">
            Paystack Secure Checkout
          </div>
          <h2 className="font-['Cinzel',serif] text-[1.35rem] text-[#F5EDD6] tracking-[0.04em] mb-1.5">
            Season 2 Application Fee
          </h2>
          <div className="font-['Cinzel',serif] text-[1.8rem] text-[#F0C04A] mb-7 border-b border-[#C9A84C]/15 pb-4">
            ₦25,000
          </div>

          <div className="flex flex-col gap-4">
            <FormField
              label="Full Name"
              type="text"
              value={name}
              onChange={setName}
              required
              placeholder="Amaka Okafor"
            />
            <FormField
              label="Email Address for Receipt"
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
              <Lock size={13} />
              {isSubmitting ? "Connecting to Paystack..." : "Continue to Secure Payment"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-5 text-[#5A5040] text-[0.68rem] font-['Raleway',sans-serif]">
            <ShieldCheck size={13} className="text-[#C9A84C]" />
            Card details are entered securely on Paystack
          </div>
        </form>
      </div>
    </div>
  );
}
