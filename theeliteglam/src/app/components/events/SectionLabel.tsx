"use client";

export default function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 font-raleway text-[0.68rem] tracking-[0.45em] text-[#C9A84C] uppercase">
      <span className="inline-block w-8 h-px bg-[#C9A84C]" />
      {text}
    </div>
  );
}
