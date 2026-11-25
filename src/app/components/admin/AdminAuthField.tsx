import { useState, type ChangeEvent, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type AdminAuthFieldProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  icon: LucideIcon;
  rightSlot?: ReactNode;
  labelClassName?: string;
};

export default function AdminAuthField({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  rightSlot,
  labelClassName = "text-[0.6rem] uppercase tracking-[0.2em]",
}: AdminAuthFieldProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div data-active={isActive ? "true" : "false"}>
      {label ? (
        <label
          htmlFor={id}
          className={`block mb-2 transition-colors ${labelClassName} ${
            isActive ? "text-[#F5EDD6]" : "text-[#9A8C6A]"
          }`}
        >
          {label}
        </label>
      ) : null}
      <div
        className={`relative flex items-center bg-[#181717] rounded px-4 py-3 border transition-colors ${
          isActive ? "border-[#9A8C6A]" : "border-transparent"
        }`}
      >
        <Icon
          className={`w-4 h-4 mr-3 transition-colors ${
            isActive ? "text-[#F5EDD6]" : "text-[#444]"
          }`}
        />
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholder={placeholder}
          aria-label={!label ? placeholder : undefined}
          className="bg-transparent w-full text-[#F5EDD6] outline-none text-base sm:text-sm"
        />
        {rightSlot}
      </div>
    </div>
  );
}