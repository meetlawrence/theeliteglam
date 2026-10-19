import type { ChangeEvent, ReactNode } from "react";
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
  labelClassName = "text-[0.6rem] uppercase tracking-[0.2em] text-[#9A8C6A]",
}: AdminAuthFieldProps) {
  return (
    <div>
      {label ? (
        <label htmlFor={id} className={`block mb-2 ${labelClassName}`}>
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center bg-[#111] border border-[#222] px-4 py-3">
        <Icon className="text-[#444] w-4 h-4 mr-3" />
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent w-full text-[#F5EDD6] outline-none text-sm"
        />
        {rightSlot}
      </div>
    </div>
  );
}
