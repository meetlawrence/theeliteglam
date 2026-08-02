"use client";

import { FieldLabel } from "./FormField";

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <FieldLabel text={label} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-[0.85rem] bg-[#0E0E0E] border border-[#C9A84C]/20 font-['Raleway',sans-serif] text-[0.9rem] outline-none cursor-pointer ${value ? "text-[#F5EDD6]" : "text-[#5A5040]"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0E0E0E] text-[#F5EDD6]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
