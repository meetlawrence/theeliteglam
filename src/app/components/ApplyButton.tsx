"use client";
import { ArrowRight } from "lucide-react";

interface ApplyButtonProps {
  eventStatus: {
    isRegistrationOpen: boolean;
  };
}

export default function ApplyButton({ eventStatus }: ApplyButtonProps) {
  if (!eventStatus) return null;

  if (!eventStatus.isRegistrationOpen) return null;

  const handleClick = () => {
    window.location.href = "/register#apply";
  };

  return (
    <button 
      className="group inline-flex items-center gap-3 bg-none border-none cursor-pointer font-cinzel text-[0.9rem] tracking-[0.2em] uppercase transition-all duration-300 pb-1 border-b border-[#C9A84C] text-[#C9A84C] hover:text-accent hover:border-accent"
      onClick={handleClick}
    >
      <span>Apply for Registration</span>
      <ArrowRight
        size={16}
        className="transform transition-transform duration-300 group-hover:translate-x-1.5"
      />
    </button>
  );
}