export function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 font-['Raleway',sans-serif] text-[0.68rem] uppercase tracking-[0.45em] text-[#C9A84C]">
      {text}
    </div>
  );
}

export function Divider() {
  return <div className="mx-8 h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.25),transparent)]" />;
}
