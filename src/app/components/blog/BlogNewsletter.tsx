"use client";

import { FormEvent, useState } from "react";

export function BlogNewsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="bg-[#121212] border border-[#C9A84C]/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
      <div className="max-w-xl mx-auto space-y-4">
        <span className="font-['Raleway',sans-serif] text-[0.65rem] tracking-[0.35em] text-[#C9A84C] uppercase">
          Stay Connected
        </span>
        <h2 className="font-['Cinzel',serif] text-2xl sm:text-3xl text-[#F5EDD6]">
          Subscribe to The Royal Dispatch
        </h2>
        <p className="font-['Raleway',sans-serif] text-xs sm:text-sm text-[#9A8C6A] leading-relaxed">
          Receive VIP pageant announcements, exclusive contestant stories, and event updates directly in your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-[#0A0A0A] border border-[#C9A84C]/30 px-4 py-3 text-xs font-['Raleway',sans-serif] text-[#F5EDD6] placeholder-[#5A5040] focus:outline-none focus:border-[#C9A84C]"
          />
          <button
            type="submit"
            className="py-3 px-6 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-[#080808] font-['Cinzel',serif] text-xs uppercase font-bold tracking-wider hover:brightness-110 transition-all whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}