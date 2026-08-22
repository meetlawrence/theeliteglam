"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Check, X } from "lucide-react";
import { FormField } from "./FormField";

type RegStep = "payment" | "processing" | "success";

export function RegistrationPaymentModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<RegStep>("payment");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2800);
  };

  return (
    <div
      onClick={step === "processing" ? undefined : onClose}
      className="fixed inset-0 z-50 bg-black/88 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0E0E0E] border border-[#C9A84C]/25 shadow-[0_0_100px_rgba(201,168,76,0.1)] max-w-[460px] w-full max-h-[92vh] overflow-y-auto relative p-10"
      >
        {step !== "processing" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-[#C9A84C]/[0.08] border border-[#C9A84C]/20 text-[#C9A84C] cursor-pointer w-8 h-8 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        )}

        {step === "payment" && (
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
              <FormField label="Email Address for Receipt" type="email" value={email} onChange={setEmail} required placeholder="you@email.com" />
              <FormField label="Card Number" type="text" value={cardNumber} onChange={(v) => setCardNumber(formatCard(v))} required placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Expiry Date" type="text" value={expiry} onChange={(v) => setExpiry(formatExpiry(v))} required placeholder="MM / YY" />
                <FormField label="CVV" type="password" value={cvv} onChange={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))} required placeholder="123" />
              </div>

              <button
                type="submit"
                className="mt-4 w-full py-4.5 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] border-none text-[#080808] font-['Cinzel',serif] text-[0.82rem] tracking-[0.22em] uppercase cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock size={13} />
                Pay ₦25,000 Securely
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-5 text-[#5A5040] text-[0.68rem] font-['Raleway',sans-serif]">
              <ShieldCheck size={13} className="text-[#C9A84C]" />
              Encrypted & Secured via Paystack
            </div>
          </form>
        )}

        {step === "processing" && (
          <div className="text-center py-10">
            <div className="w-[50px] h-[50px] mx-auto mb-6 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin" />
            <div className="font-['Cinzel',serif] text-[1.1rem] text-[#F5EDD6] mb-2">
              Processing Payment...
            </div>
            <p className="font-['Raleway',sans-serif] text-[0.8rem] text-[#9A8C6A]">
              Please do not close this window while we verify your transaction.
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-[60px] h-[60px] mx-auto mb-5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C] flex items-center justify-center">
              <Check size={24} className="text-[#F0C04A]" />
            </div>
            <div className="font-['Cinzel',serif] text-[1.2rem] text-[#F5EDD6] mb-2">
              Payment Successful!
            </div>
            <p className="font-['Raleway',sans-serif] text-[0.85rem] text-[#9A8C6A]">
              Redirecting you to the application form...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
