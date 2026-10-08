"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

interface AdminHeaderProps {
  mobileOpen: boolean;
  onMobileMenuToggle: () => void;
  user: { name: string; role?: string };
}

const handleSignout = async () => {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    window.location.href = "/admin"; // Force redirect to login
  }
};

export function AdminHeader({ mobileOpen, onMobileMenuToggle, user }: AdminHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams?.get("section") || "";

  const getPageInfo = () => {
    const key = section?.toLowerCase();
    if (key === "overview") return { title: "Overview", sub: "" };
    if (key === "contestants") return { title: "Contestants", sub: "" };
    if (key === "financials") return { title: "Financials", sub: "" };
    if (key === "tickets") return { title: "Tickets", sub: "" };

    // fallback to path-based detection
    if (pathname?.includes("/dashboard")) return { title: "Overview", sub: "" };
    if (pathname?.includes("/contestants"))
      return { title: "Contestants", sub: "Manage Candidates" };
    if (pathname?.includes("/financials")) return { title: "Financials", sub: "Revenue Report" };
    if (pathname?.includes("/tickets")) return { title: "Tickets", sub: "Sales & Access" };
    return { title: "Portal", sub: "Admin" };
  };

  const { title, sub } = getPageInfo();
  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "AD";

  return (
    <header className="flex w-full items-center justify-between gap-4 border-b border-[#C9A84C]/10 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 border border-[#C9A84C]/30 text-[#C9A84C] md:hidden"
          onClick={onMobileMenuToggle}
          aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
          <h1 className="font-['Cinzel',serif] text-[clamp(1.4rem,3vw,2.4rem)] tracking-[0.06em] text-[#F5EDD6]">
            {title}
          </h1>
          {sub && (
            <span className="text-muted-foreground text-xs uppercase tracking-widest">{sub}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-[#0D0D0D] border border-[#1a170e] px-3 py-2">
          <div className="bg-[#C9A84C] text-[#080808] font-bold text-xs px-2 py-1">{initials}</div>
          <button 
            type="button" 
            onClick={handleSignout} 
            className="flex items-center focus:outline-none"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-[#C9A84C]" />
          </button>
        </div>
      </div>
    </header>
  );
}