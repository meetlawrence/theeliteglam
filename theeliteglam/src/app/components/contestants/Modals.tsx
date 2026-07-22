import React, { useState } from "react";
import Image from "next/image";
import { Heart, CreditCard, Check } from "lucide-react";
import type { Contestant } from "./types";

type VoteStep = "payment" | "processing" | "success";

export function VotePaymentModal({
  contestant,
  onSuccess,
  onClose,
}: {
  contestant: Contestant;
  onSuccess: (qty: number) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<VoteStep>("payment");
  const [qty, setQty] = useState(5);
  const [customVotes, setCustomVotes] = useState("");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });

  const pricePerVote = 1000;
  const total = qty * pricePerVote;

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const canPay =
    card.name.trim().length > 0 &&
    card.number.replace(/\s/g, "").length === 16 &&
    card.expiry.length === 5 &&
    card.cvv.length >= 3;

  const handlePay = () => {
    if (!canPay) return;
    setStep("processing");
    setTimeout(() => setStep("success"), 2800);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-600 flex items-center justify-center bg-[rgba(2,2,2,0.88)] p-4 sm:p-6 backdrop-blur-[12px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto  border border-[rgba(201,168,76,0.22)] bg-[linear-gradient(145deg,rgba(13,13,13,0.98),rgba(8,8,8,0.96))] shadow-[0_0_90px_rgba(201,168,76,0.14)] ring-1 ring-[rgba(201,168,76,0.08)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgba(201,168,76,0.12)]"
        >
          ×
        </button>

        <div className="flex items-center gap-4 px-6 pt-6 pb-0">
          <div className="relative shrink-0 w-13 h-13 overflow-hidden border border-[rgba(201,168,76,0.3)]">
            <Image
              src={contestant.image}
              alt={contestant.name}
              fill
              className="object-cover object-top"
            />
          </div>
          <div>
            <div className="font-cinzel text-sm text-cream tracking-wider">{contestant.name}</div>
            <div className="font-raleway text-xs text-[#C9A84C] tracking-widest uppercase">
              {contestant.number} · {contestant.state}
            </div>
          </div>
        </div>

        <div className="h-px bg-[rgba(201,168,76,0.1)] mx-6 my-5" />

        {step === "payment" && (
          <div className="p-6">
            <div className="font-cinzel text-xs tracking-widest text-[#C9A84C] uppercase mb-5">
              ✦ Vote via Secure Payment
            </div>

            <div className="mb-5">
              <div className="font-raleway text-xs tracking-wider uppercase mb-2.5">
                Select or Enter Votes · ₦1,000 each
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {[5, 10, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setQty(n);
                      setCustomVotes("");
                    }}
                    className={`w-12 h-12 font-cinzel text-sm transition-all duration-250 ${
                      qty === n && customVotes === ""
                        ? "bg-linear-to-br from-[#C9A84C] to-[#8B6914] text-black border-transparent"
                        : "bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.2)] hover:bg-[rgba(201,168,76,0.1)]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div>
                <input
                  type="number"
                  min="5"
                  placeholder="Enter a minimum of 5 votes"
                  value={customVotes}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomVotes(val);
                    const parsed = parseInt(val, 10);
                    setQty(!val ? 5 : Math.max(5, parsed || 5));
                  }}
                  className="w-full px-4 py-3 font-raleway text-sm bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] text-cream placeholder-muted-light outline-none focus:border-[rgba(201,168,76,0.5)] focus:bg-[rgba(201,168,76,0.1)] transition-colors"
                />
              </div>
            </div>

            <div className="bg-linear-to-br from-[#1a1600] to-[#0a0900] border border-[rgba(201,168,76,0.2)] p-5 mb-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-ellipse opacity-10" />
              <div className="flex justify-between items-start mb-6">
                <CreditCard size={22} className="text-[rgba(201,168,76,0.6)]" />
                <div className="font-raleway text-xs tracking-wider text-[rgba(201,168,76,0.4)] uppercase">
                  Secure · Encrypted
                </div>
              </div>
              <div className="font-mono text-base tracking-widest text-cream mb-4">
                {card.number || "•••• •••• •••• ••••"}
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="font-raleway text-xs tracking-wider text-[#C9A84C] uppercase mb-1">
                    Cardholder
                  </div>
                  <div className="font-raleway text-sm text-cream tracking-wide">
                    {card.name || "YOUR NAME"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-raleway text-xs tracking-wider text-[#C9A84C] uppercase mb-1">
                    Expires
                  </div>
                  <div className="font-raleway text-sm text-cream">{card.expiry || "MM/YY"}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mb-5">
              <input
                placeholder="Cardholder Name"
                value={card.name}
                onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                className="w-full px-4 py-3 font-raleway text-sm bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] text-cream placeholder-muted-light outline-none focus:border-[rgba(201,168,76,0.5)] focus:bg-[rgba(201,168,76,0.1)] transition-colors"
              />
              <input
                placeholder="Card Number"
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
                maxLength={19}
                className="w-full px-4 py-3 font-raleway text-sm bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] text-cream placeholder-muted-light outline-none focus:border-[rgba(201,168,76,0.5)] focus:bg-[rgba(201,168,76,0.1)] transition-colors"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                  maxLength={5}
                  className="w-full px-4 py-3 font-raleway text-sm bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] text-cream placeholder-muted-light outline-none focus:border-[rgba(201,168,76,0.5)] focus:bg-[rgba(201,168,76,0.1)] transition-colors"
                />
                <input
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))
                  }
                  maxLength={4}
                  type="password"
                  className="w-full px-4 py-3 font-raleway text-sm bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.2)] text-cream placeholder-muted-light outline-none focus:border-[rgba(201,168,76,0.5)] focus:bg-[rgba(201,168,76,0.1)] transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.12)] mb-4">
              <div className="font-raleway text-sm text-cream">
                {qty} vote{qty > 1 ? "s" : ""} for {contestant.name.split(" ")[0]}
              </div>
              <div className="font-cinzel text-lg text-highlight">₦{total.toLocaleString()}</div>
            </div>

            <button
              onClick={handlePay}
              disabled={!canPay}
              className={`w-full py-3 font-cinzel text-xs tracking-widest uppercase transition-all duration-300 ${
                canPay
                  ? "bg-linear-to-br from-[#C9A84C] to-[#8B6914] border-transparent text-black cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(201,168,76,0.25)] active:scale-[0.98]"
                  : "bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] text-muted-dark cursor-not-allowed"
              }`}
            >
              Pay ₦{total.toLocaleString()} · Vote Now
            </button>

            <div className="text-center mt-3 font-raleway text-[0.65rem] text-muted tracking-wide">
              Secured with 256-bit encryption
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="py-14 px-6 text-center">
            <div className="w-15 h-15 mx-auto mb-6 border-2 border-[rgba(201,168,76,0.15)] border-t-[#C9A84C] rounded-full animate-spin" />
            <div className="font-cinzel text-lg text-cream tracking-wider mb-2">
              Processing Payment
            </div>
            <div className="font-raleway text-sm text-muted">Please do not close this window</div>
          </div>
        )}
        {step === "success" && (
          <div className="py-10 px-6 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-linear-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center">
              <Check size={28} className="text-black" />
            </div>
            <div className="font-cinzel text-2xl text-cream tracking-wider mb-2">
              Vote{qty > 1 ? "s" : ""} Confirmed!
            </div>
            <p className="font-raleway text-sm text-cream leading-relaxed mb-2">
              You&apos;ve cast{" "}
              <span className="text-highlight font-cinzel">
                {qty} vote{qty > 1 ? "s" : ""}
              </span>{" "}
              for
            </p>
            <p className="font-cinzel text-lg text-[#C9A84C] tracking-wider mb-6">
              {contestant.name}
            </p>
            <div className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)] px-4 py-4 mb-6 font-raleway text-sm text-cream leading-relaxed">
              Your vote has been recorded and the leaderboard updated.
              <br />
              Thank you for supporting The Elite Glam Season 2.
            </div>
            <button
              onClick={onSuccess.bind(null, qty)}
              className="w-full py-3 bg-linear-to-br from-[#C9A84C] to-[#8B6914] border-transparent text-black font-cinzel text-xs tracking-widest uppercase cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(201,168,76,0.25)] active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ContestantModal({
  contestant,
  flashing,
  onVote,
  onClose,
}: {
  contestant: Contestant;
  flashing: boolean;
  onVote: () => void;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-500 flex items-center justify-center bg-[rgba(2,2,2,0.86)] p-4 sm:p-6 backdrop-blur-[12px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden overflow-y-auto border border-[rgba(201,168,76,0.22)] bg-[linear-gradient(145deg,rgba(13,13,13,0.98),rgba(8,8,8,0.96))] shadow-[0_0_90px_rgba(201,168,76,0.14)] ring-1 ring-[rgba(201,168,76,0.08)] grid grid-cols-1 sm:grid-cols-[280px_1fr]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgba(201,168,76,0.12)]"
        >
          ×
        </button>

        <div className="relative min-h-[280px] sm:min-h-[340px]">
          <Image
            src={contestant.image}
            alt={contestant.name}
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#060606]/95 via-[#060606]/25 to-transparent" />
          <div className="absolute top-4 left-4 bg-black/70 border border-[rgba(201,168,76,0.35)] backdrop-blur-md px-2.5 py-1 font-cinzel text-xs text-highlight tracking-wider">
            {contestant.number}
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
            <Heart
              size={13}
              className={`${flashing ? "fill-[#C9A84C] text-[#C9A84C]" : "text-[#C9A84C]"} transition-all duration-300`}
            />
            <span
              className={`font-cinzel text-sm ${flashing ? "text-highlight" : "text-tan"} transition-colors duration-300`}
            >
              {contestant.votes.toLocaleString()} votes
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="font-raleway text-xs tracking-[0.4em] text-[#C9A84C] uppercase mb-2">
            {contestant.state} · {contestant.tribe}
          </div>
          <h2 className="font-cinzel text-3xl text-cream tracking-widest leading-tight mb-1">
            {contestant.name}
          </h2>
          <div className="font-raleway text-xs text-[#9c8f67] tracking-widest uppercase mb-6">
            Age {contestant.age} · {contestant.occupation}
          </div>

          <div className="h-px bg-[rgba(201,168,76,0.22)] mb-6" />

          <p className="font-raleway text-sm text-[#9c8f67] leading-relaxed mb-6">
            {contestant.bio}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
            {[
              { label: "Advocacy", value: contestant.advocacy },
              { label: "Fun Fact", value: contestant.funFact },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.1)] p-4"
              >
                <div className="font-raleway text-xs tracking-widest text-[#C9A84C] uppercase mb-1.5">
                  {label}
                </div>
                <div className="font-raleway text-sm text-[#9c8f67] leading-relaxed">{value}</div>
              </div>
            ))}
          </div>

          <button
            onClick={onVote}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-6 font-cinzel text-xs tracking-widest uppercase transition-all duration-300 bg-linear-to-br from-[#C9A84C] to-[#8B6914] text-black hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(201,168,76,0.25)] active:scale-[0.98]"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
}
