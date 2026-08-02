"use client";

function FieldLabel({ text }: { text: string }) {
  return (
    <label className="block font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.2em] text-[#9A8C6A] uppercase mb-[0.5rem]">
      {text}
    </label>
  );
}

export function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel text={label} />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-[0.85rem] bg-white/[0.02] border border-[#C9A84C]/20 text-[#F5EDD6] font-['Raleway',sans-serif] text-[0.9rem] outline-none transition-colors duration-300 focus:border-[#C9A84C]"
      />
    </div>
  );
}

export { FieldLabel };
