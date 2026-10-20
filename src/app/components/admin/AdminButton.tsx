"use client";

interface AdminButtonProps {
  label: string;
  variant?: "filled" | "ghost" | "danger" | "secondary";
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function AdminButton({
  label,
  variant = "ghost",
  onClick,
  className = "",
  children,
}: AdminButtonProps) {
  const baseClass =
    "flex items-center gap-2 font-cinzel text-[0.68rem] tracking-[0.2em] px-5 py-2.5 uppercase transition-all hover:-translate-y-[1px]";

  const variants = {
    filled:
      "bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-black hover:shadow-lg hover:shadow-[#C9A84C]/40",
    ghost: "border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10",
    danger: "border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/10",
    secondary: "border border-[#9A8C6A]/40 text-[#9A8C6A] hover:bg-[#9A8C6A]/10",
  };

  return (
    <button onClick={onClick} className={`${baseClass} ${variants[variant]} ${className}`}>
      {children} {label}
    </button>
  );
}
