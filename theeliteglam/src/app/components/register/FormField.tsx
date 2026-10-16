"use client";

function FieldLabel({ text, htmlFor }: { text: string; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.2em] text-[#9A8C6A] uppercase mb-[0.5rem]">
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
  error,
  min,
  max,
  step,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: string;
  max?: string;
  step?: string;
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const errorId = `${id}-error`;

  return (
    <div>
      <FieldLabel text={label} htmlFor={id} />
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full px-4 py-[0.85rem] bg-white/[0.02] border text-[#F5EDD6] font-['Raleway',sans-serif] text-[0.9rem] outline-none transition-colors duration-300 focus:border-[#C9A84C] ${
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

export { FieldLabel };
