import React, { useState } from "react";
import Image from "next/image";
import { Heart, CreditCard, Check } from "lucide-react";
import { Contestant } from "./types";

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
  const [qty, setQty] = useState(1);
  const [customVotes, setCustomVotes] = useState("");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });

  const pricePerVote = 1000;
  const total = qty * pricePerVote;

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
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
      className="fixed inset-0 z-600 flex items-center justify-center bg-black/88 p-6 backdrop-blur-[10px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0E0E0E] border border-gold/25 shadow-[0_0_100px_rgba(201,168,76,0.12)]"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 bg-gold/8 border border-gold/20 text-gold cursor-pointer hover:bg-gold/12 transition-colors"
        >
          ×
        </button>

        <div className="flex items-center gap-4 px-6 pt-6 pb-0">
          <div className="relative shrink-0 w-13 h-13 overflow-hidden border border-gold/30">
            <Image src={contestant.image} alt={contestant.name} fill className="object-cover object-top" />
          </div>
          <div>
            <div className="font-cinzel text-sm text-cream tracking-wider">
              {contestant.name}
            </div>
            <div className="font-raleway text-xs text-gold tracking-widest uppercase">
              {contestant.number} · {contestant.state}
            </div>
          </div>
        </div>

        <div className="h-px bg-gold/10 mx-6 my-5" />

        {step === "payment" && (
          <div className="p-6">
            <div className="font-cinzel text-xs tracking-widest text-gold uppercase mb-5">
              ✦ Vote via Secure Payment
            </div>

            <div className="mb-5">
              <div className="font-raleway text-xs tracking-wider text-muted uppercase mb-2.5">
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
                        ? "bg-linear-to-br from-gold to-gold-dark text-black border-transparent"
                        : "bg-gold/6 border border-gold/20 text-muted hover:bg-gold/10"
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
                  className="w-full px-4 py-3 font-raleway text-sm bg-gold/5 border border-gold/20 text-cream placeholder-muted-light outline-none focus:border-gold/50 focus:bg-gold/10 transition-colors"
                />
              </div>
            </div>

            <div className="bg-linear-to-br from-[#1a1600] to-[#0a0900] border border-gold/20 rounded-sm p-5 mb-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-ellipse opacity-10" />
              <div className="flex justify-between items-start mb-6">
                <CreditCard size={22} className="text-gold/60" />
                <div className="font-raleway text-xs tracking-wider text-gold/40 uppercase">
                  Secure · Encrypted
                </div>
              </div>
              <div className="font-mono text-base tracking-widest text-cream mb-4">
                {card.number || "•••• •••• •••• ••••"}
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="font-raleway text-xs tracking-wider text-gold uppercase mb-1">Cardholder</div>
                  <div className="font-raleway text-sm text-cream tracking-wide">
                    {card.name || "YOUR NAME"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-raleway text-xs tracking-wider text-gold uppercase mb-1">Expires</div>
                  <div className="font-raleway text-sm text-cream">
                    {card.expiry || "MM/YY"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mb-5">
              <input
                placeholder="Cardholder Name"
                value={card.name}
                onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                className="w-full px-4 py-3 font-raleway text-sm bg-gold/5 border border-gold/20 text-cream placeholder-muted-light outline-none focus:border-gold/50 focus:bg-gold/10 transition-colors"
              />
              <input
                placeholder="Card Number"
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
                maxLength={19}
                className="w-full px-4 py-3 font-raleway text-sm bg-gold/5 border border-gold/20 text-cream placeholder-muted-light outline-none focus:border-gold/50 focus:bg-gold/10 transition-colors"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                  maxLength={5}
                  className="w-full px-4 py-3 font-raleway text-sm bg-gold/5 border border-gold/20 text-cream placeholder-muted-light outline-none focus:border-gold/50 focus:bg-gold/10 transition-colors"
                />
                <input
                  placeholder="CVV"
                  value={card.cvv}
                  onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  maxLength={4}
                  type="password"
                  className="w-full px-4 py-3 font-raleway text-sm bg-gold/5 border border-gold/20 text-cream placeholder-muted-light outline-none focus:border-gold/50 focus:bg-gold/10 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-between items-center px-4 py-3 bg-gold/5 border border-gold/12 mb-4">
              <div className="font-raleway text-sm text-muted">
                {qty} vote{qty > 1 ? "s" : ""} for {contestant.name.split(" ")[0]}
              </div>
              <div className="font-cinzel text-lg text-highlight">
                ₦{total.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={!canPay}
              className={`w-full py-3 font-cinzel text-xs tracking-widest uppercase transition-all duration-300 ${
                canPay
                  ? "bg-linear-to-br from-gold to-gold-dark border-transparent text-black cursor-pointer hover:shadow-lg hover:shadow-gold/35"
                  : "bg-gold/8 border border-gold/15 text-muted-dark cursor-not-allowed"
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
            <div className="w-15 h-15 mx-auto mb-6 border-2 border-gold/15 border-t-gold rounded-full animate-spin" />
            <div className="font-cinzel text-lg text-cream tracking-wider mb-2">
              Processing Payment
            </div>
            <div className="font-raleway text-sm text-muted">
              Please do not close this window
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-10 px-6 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-linear-to-br from-gold to-gold-dark flex items-center justify-center">
              <Check size={28} className="text-black" />
            </div>
            <div className="font-cinzel text-2xl text-cream tracking-wider mb-2">
              Vote{qty > 1 ? "s" : ""} Confirmed!
            </div>
            <p className="font-raleway text-sm text-muted leading-relaxed mb-2">
              You&apos;ve cast <span className="text-highlight font-cinzel">{qty} vote{qty > 1 ? "s" : ""}</span> for
            </p>
            <p className="font-cinzel text-lg text-gold tracking-wider mb-6">
              {contestant.name}
            </p>
            <div className="bg-gold/5 border border-gold/15 px-4 py-4 mb-6 font-raleway text-sm text-muted leading-relaxed">
              Your vote has been recorded and the leaderboard updated.<br />
              Thank you for supporting The Elite Glam Season 2.
            </div>
            <button
              onClick={onSuccess.bind(null, qty)}
              className="w-full py-3 bg-linear-to-br from-gold to-gold-dark border-transparent text-black font-cinzel text-xs tracking-widest uppercase cursor-pointer hover:shadow-lg hover:shadow-gold/35 transition-all duration-300"
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
  votesLeft,
  flashing,
  onVote,
  onClose,
}: {
  contestant: Contestant;
  votesLeft: number;
  flashing: boolean;
  onVote: () => void;
  onClose: () => void;
}) {
  const exhausted = votesLeft <= 0;
  const voteButtonVariant = exhausted
    ? "bg-gold/5 border border-gold/12 text-muted-dark cursor-not-allowed"
    : "bg-linear-to-br from-gold to-gold-dark text-black";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-500 flex items-center justify-center bg-black/82 p-6 backdrop-blur"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0E0E0E] border border-gold/22 shadow-[0_0_80px_rgba(201,168,76,0.1)] grid grid-cols-[260px_1fr]"
        style={{ gridTemplateColumns: "260px 1fr" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 bg-gold/8 border border-gold/20 text-gold cursor-pointer hover:bg-gold/12 transition-colors"
        >
          ×
        </button>

        <div className="relative" style={{ minHeight: "340px" }}>
          <Image src={contestant.image} alt={contestant.name} fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0E0E0E]/90 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 bg-black/75 border border-gold/35 backdrop-blur-md px-2.5 py-1 font-cinzel text-xs text-highlight tracking-wider">
            {contestant.number}
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
            <Heart
              size={13}
              className={`${flashing ? "fill-gold text-gold" : "text-gold"} transition-all duration-300`}
            />
            <span className={`font-cinzel text-sm ${flashing ? "text-highlight" : "text-tan"} transition-colors duration-300`}>
              {contestant.votes.toLocaleString()} votes
            </span>
          </div>
        </div>

        <div className="p-10">
          <div className="font-raleway text-xs tracking-[0.4em] text-gold uppercase mb-2">
            {contestant.state} · {contestant.tribe}
          </div>
          <h2 className="font-cinzel text-3xl text-cream tracking-widest leading-tight mb-1">
            {contestant.name}
          </h2>
          <div className="font-raleway text-xs text-muted tracking-widest uppercase mb-6">
            Age {contestant.age} · {contestant.occupation}
          </div>

          <div className="h-px bg-gold/12 mb-6" />

          <p className="font-raleway text-sm text-muted leading-relaxed mb-6">
            {contestant.bio}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-7">
            {[
              { label: "Advocacy", value: contestant.advocacy },
              { label: "Fun Fact", value: contestant.funFact },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gold/4 border border-gold/10 p-4">
                <div className="font-raleway text-xs tracking-widest text-gold uppercase mb-1.5">
                  {label}
                </div>
                <div className="font-raleway text-sm text-tan leading-relaxed">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onVote}
            disabled={exhausted}
            className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-6 font-cinzel text-xs tracking-widest uppercase transition-all duration-300 ${voteButtonVariant}`}
          >
            Vote
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .modal-inner { grid-template-columns: 1fr !important; }
          .modal-inner > div:first-child { min-height: 260px !important; }
        }
      `}</style>
    </div>
  );
}


