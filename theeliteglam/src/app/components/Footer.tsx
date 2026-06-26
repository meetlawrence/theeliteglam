"use client";

import { useState } from "react";
import Image from "next/image";
import { PiTiktokLogo } from "react-icons/pi";
import { FiYoutube, FiFacebook, FiInstagram } from "react-icons/fi";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

const LINKS = {
  "The Pageant": ["About Us", "History", "Our Mission", "Past Winners", "Gallery"],
  "Participate": ["Register", "Contestant FAQ", "Judging Criteria", "Audition Cities", "Scholarships"],
  "Franchise": ["Become a Franchisee", "Sponsor Packages", "Media Kit", "Brand Guidelines", "Contact"],
};

const SOCIALS = [
  { icon: <FiInstagram size={18} />, label: "Instagram", link: "https://www.instagram.com/theeliteglampageant" },
  { icon: <PiTiktokLogo size={18} />, label: "Tiktok", link: "https://www.tiktok.com/@theeliteglampageant" },
  { icon: <FiYoutube size={18} />, label: "YouTube", link: "https://www.youtube.com/@theeliteglampageant" },
  { icon: <FiFacebook size={18} />, label: "Facebook", link: "https://www.facebook.com/theeliteglampageant" },
];

export function Footer({ onNavigate }: { onNavigate?: (page: "register") => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="bg-[#050505] border-t border-[#C9A84C]/20 text-[#F5EDD6]">
      {/* Top CTA band */}
      <div className="bg-linear-to-br from-[#C9A84C]/12 to-[#C9A84C]/4 border-b border-[#C9A84C]/12 py-14 px-8">
        <div className="max-w-325 mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-cinzel text-[clamp(1.4rem,3vw,2.2rem)] text-[#F5EDD6] tracking-[0.06em] mb-2">
              Stay In the Spotlight
            </h3>
            <p className="font-playfair text-base text-muted-foreground italic">
              Subscribe for audition updates, exclusive content, and event announcements.
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} className="w-full">
            {submitted ? (
              <div className="font-cinzel text-sm text-[#C9A84C] tracking-widest p-4 border border-[#C9A84C]/30 text-center">
                ✦ You&apos;re on the list. Welcome to the Elite.
              </div>
            ) : (
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-[#C9A84C]/6 border border-[#C9A84C]/25 border-r-0 text-[#F5EDD6] font-raleway text-sm px-5 py-3.5 outline-none"
                />
                <button type="submit" className="bg-linear-to-br from-[#C9A84C] to-[#8B6914] text-[#080808] px-6 py-3.5 font-cinzel text-xs tracking-[0.15em] uppercase flex items-center gap-2 transition-opacity hover:opacity-90">
                  Subscribe <ArrowRight size={14} />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-325 mx-auto px-8 pt-20 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">

        {/* Brand column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Image src="/logo.svg" alt="Crown" width={80} height={36} className="mix-blend-screen drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]" />
            <Image src="/wordmark.svg" alt="Elite Glam" width={100} height={22} className="mix-blend-screen drop-shadow-[0_0_6px_rgba(201,168,76,0.3)]" />
          </div>
          <p className="font-raleway text-sm text-muted-foreground leading-[1.8] mb-8 max-w-70">
            Nigeria&apos;s premiere platform celebrating beauty, intelligence, culture, leadership, and impact.
          </p>
          <div className="flex gap-3 mb-8">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.link} target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-[#C9A84C]/20 flex items-center justify-center hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] text-muted-foreground hover:text-accent transition-all">
                {s.icon}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3 font-raleway text-xs text-muted-foreground">
            {[ { icon: Mail, text: "theeliteglampageant@gmail.com" }, { icon: Phone, text: "+1 (347) 466-3081" }, { icon: MapPin, text: "Lagos, Nigeria" } ].map((item, i) => (
              <div key={i} className="flex items-center gap-2"><span className="text-[#C9A84C]">{<item.icon size={13} />}</span>{item.text}</div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([cat, links]) => (
          <div key={cat}>
            <h4 className="font-cinzel font-thin text-xs uppercase tracking-[0.2em] text-[#C9A84C] mb-6 border-b border-[#C9A84C]/15 pb-3">
              {cat}
            </h4>
            <div className="flex flex-col gap-3">
              {links.map(link => (
                <button 
                  key={link} 
                  onClick={() => link === "Register" && onNavigate?.("register")}
                  className="group font-raleway text-sm text-muted-foreground hover:text-[#C9A84C] transition-colors flex items-center gap-2 text-left"
                >
                  <span className="hidden group-hover:block text-[10px] text-[#C9A84C]">✦</span> {link}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#C9A84C]/10 py-6 px-8">
        <div className="max-w-325 mx-auto flex justify-between items-center flex-wrap gap-4 font-raleway text-xs  tracking-[0.08em] text-[#5A5040]">
          <p>© 2025 The Elite Glam. All rights reserved. Unveiling Excellence. Embracing Diversity</p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map(item => (
              <a key={item} href="#" className="hover:text-[#C9A84C] transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}