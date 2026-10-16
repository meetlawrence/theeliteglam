"use client";

import { FieldLabel } from "./FormField";

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  required?: boolean;
  error?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const errorId = `${id}-error`;

  return (
    <div>
      <FieldLabel text={label} htmlFor={id} />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-4 py-[0.85rem] bg-[#0E0E0E] border font-['Raleway',sans-serif] text-[0.9rem] outline-none cursor-pointer ${
          error ? "border-[#C96B5D]" : "border-[#C9A84C]/20"
        } ${value ? "text-[#F5EDD6]" : "text-[#5A5040]"}`}
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
      {error && (
        <p id={errorId} role="alert" className="font-['Raleway',sans-serif] text-[0.7rem] text-[#C96B5D] mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
