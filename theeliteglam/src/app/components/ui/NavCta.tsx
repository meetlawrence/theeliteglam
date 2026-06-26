"use client";

interface NavCtaProps {
  icon: React.ReactNode;
  label: string;
  variant?: "ghost" | "filled";
  onClick?: () => void;
  className?: string;
}

export function NavCta({ 
  icon, 
  label, 
  variant = "ghost", 
  onClick,
  className = "" 
}: NavCtaProps) {
  const baseClass = "flex items-center gap-2 font-cinzel text-[0.68rem] tracking-[0.2em] px-5 py-2.5 uppercase transition-all hover:-translate-y-[1px]";
  
  const variants = {
    filled: "bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-black hover:shadow-lg hover:shadow-[#C9A84C]/40",
    ghost: "border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseClass} ${variants[variant]} ${className}`}
    >
      {icon} {label}
    </button>
  );
}