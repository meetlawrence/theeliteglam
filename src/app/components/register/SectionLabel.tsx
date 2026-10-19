export function SectionLabel({ text }: { text: string }) {
  return (
    <div className="font-['Raleway',sans-serif] text-[0.68rem] tracking-[0.4em] text-[#C9A84C] uppercase mb-[0.8rem] flex items-center gap-[0.8rem]">
      <span className="w-6 h-[1px] bg-[#C9A84C] inline-block" />
      {text}
    </div>
  );
}
