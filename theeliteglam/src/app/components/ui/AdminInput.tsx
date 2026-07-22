export function AdminInput({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.65rem] uppercase tracking-[0.2em] text-[#9A8C6A]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-[#0D0D0D] border border-[rgba(201,168,76,0.2)] p-3 text-[#F5EDD6] outline-none focus:border-[#C9A84C] transition-all"
      />
    </div>
  );
}
