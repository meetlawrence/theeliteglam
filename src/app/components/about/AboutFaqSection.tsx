"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionLabel } from "../ui/SectionDivider";

type FaqItemData = {
  q: string;
  a: string;
};

type AboutFaqSectionProps = {
  faqs: FaqItemData[];
};

export function AboutFaqSection({ faqs }: AboutFaqSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div id="faq" className="mx-auto max-w-[860px] px-8 py-28">
      <SectionLabel text="Frequently Asked Questions" />
      <h2 className="mt-4 mb-12 font-['Cinzel',serif] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.15] tracking-[0.05em] text-[#F5EDD6]">
        Everything You Need to Know
      </h2>

      <div className="flex flex-col">
        {faqs.map((faq, index) => (
          <FaqItem
            key={faq.q}
            faq={faq}
            index={index}
            isOpen={openFaq === index}
            isLast={index === faqs.length - 1}
            onToggle={() => setOpenFaq(openFaq === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

function FaqItem({ faq, index, isOpen, isLast, onToggle }: { faq: FaqItemData; index: number; isOpen: boolean; isLast: boolean; onToggle: () => void }) {
  return (
    <div className={`border-y ${isLast ? "border-[rgba(201,168,76,0.12)]" : "border-t border-[rgba(201,168,76,0.12)]"}`}>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 bg-transparent px-0 py-7 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-5">
          <span className="mt-0.5 shrink-0 font-['Cinzel',serif] text-[0.65rem] tracking-[0.15em] text-[#C9A84C]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={`font-['Cinzel',serif] text-[0.95rem] leading-[1.4] tracking-[0.04em] transition-colors duration-300 ${isOpen ? "text-[#F0C04A]" : "text-[#F5EDD6]"}`}>
            {faq.q}
          </span>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-[#C9A84C] transition-transform duration-400 ${isOpen ? "rotate-180" : "rotate-0"}`} />
      </button>

      <div className={`grid overflow-hidden transition-all duration-450 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="pb-7 pl-10 font-['Raleway',sans-serif] text-[0.92rem] leading-[1.85] text-[#9A8C6A]">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}
