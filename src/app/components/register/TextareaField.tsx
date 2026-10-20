"use client";

import { FieldLabel } from "./FormField";

export function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const errorId = `${id}-error`;

  return (
    <div>
      <FieldLabel text={label} htmlFor={id} />
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-4 py-[0.85rem] bg-white/[0.02] border text-[#F5EDD6] font-['Raleway',sans-serif] text-[0.9rem] outline-none resize-y focus:border-[#C9A84C] ${
          error ? "border-[#C96B5D]" : "border-[#C9A84C]/20"
        }`}
      />
      {error && (
        <p id={errorId} role="alert" className="font-['Raleway',sans-serif] text-[0.7rem] text-[#C96B5D] mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
