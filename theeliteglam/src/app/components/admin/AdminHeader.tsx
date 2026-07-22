"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Bell, LogOut, Menu, X } from "lucide-react";

interface AdminHeaderProps {
  mobileOpen: boolean;
  onMobileMenuToggle: () => void;
  user: { name: string; role?: string };
}

const handleSignout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/admin"; // Force redirect to login
};

export function AdminHeader({ mobileOpen, onMobileMenuToggle, user }: AdminHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams?.get("section") || "";

  // Logic to determine title/subtitle based on query param or path
  const getPageInfo = () => {
    const key = section?.toLowerCase();
    if (key === "overview") return { title: "Overview", sub: "Season 2026" };
    if (key === "contestants") return { title: "Contestants", sub: "Manage Candidates" };
    if (key === "financials") return { title: "Financials", sub: "Revenue Report" };
    if (key === "tickets") return { title: "Tickets", sub: "Sales & Access" };

    // fallback to path-based detection
    if (pathname?.includes("/dashboard")) return { title: "Overview", sub: "Season 2026" };
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
    <header className="flex items-center justify-between gap-4 py-2 border-b border-[#C9A84C]/10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="md:hidden p-2 border border-[#C9A84C]/30 text-[#C9A84C]"
          onClick={onMobileMenuToggle}
          aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-3xl text-[#F5EDD6]">{title}</h1>
          <span className="text-muted-foreground text-xs uppercase tracking-widest">{sub}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-[#F5EDD6]">
          <Bell />
        </button>
        <div className="hidden sm:flex items-center gap-3 bg-[#0D0D0D] border border-[#1a170e] px-3 py-2">
          <div className="bg-[#C9A84C] text-[#080808] font-bold text-xs px-2 py-1">{initials}</div>
          <button onClick={handleSignout}>
            <LogOut className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-[#C9A84C]" />
          </button>
        </div>
        <div className="sm:hidden flex items-center gap-3 bg-[#0D0D0D] border border-[#1a170e] px-3 py-2">
          <div className="bg-[#C9A84C] text-[#080808] font-bold text-xs px-2 py-1">{initials}</div>
          <LogOut className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-[#C9A84C]" />
        </div>
      </div>
    </header>
  );
}
