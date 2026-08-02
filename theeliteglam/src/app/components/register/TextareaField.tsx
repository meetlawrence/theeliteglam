"use client";

import { FieldLabel } from "./FormField";

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel text={label} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full px-4 py-[0.85rem] bg-white/[0.02] border border-[#C9A84C]/20 text-[#F5EDD6] font-['Raleway',sans-serif] text-[0.9rem] outline-none resize-y focus:border-[#C9A84C]"
      />
    </div>
  );
}
