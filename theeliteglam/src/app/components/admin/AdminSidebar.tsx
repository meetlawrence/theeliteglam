"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Users, DollarSign, Ticket, Settings, X } from "lucide-react";
import type { SidebarLink } from "@/app/components/admin/AdminDashboardTypes";

type AdminSidebarProps = {
  links: SidebarLink[];
  mobile?: boolean;
  onClose?: () => void;
};

const menuItems = [
  { name: "Overview", icon: LayoutGrid, param: "overview" },
  { name: "Contestants", icon: Users, param: "contestants" },
  { name: "Financials", icon: DollarSign, param: "financials" },
  { name: "Tickets", icon: Ticket, param: "tickets" },
];

const managementItems = [{ name: "Settings", icon: Settings, param: "settings" }];

export function AdminSidebar({ links, mobile = false, onClose }: AdminSidebarProps) {
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section") || "overview";

  return (
    <aside
      className={`${mobile ? "fixed inset-y-0 left-0 z-50 w-72 bg-[#080808] border-r border-[#333] shadow-xl" : "hidden md:block w-64 bg-[#080808] border-r border-[#333] sticky top-0 h-screen"}`}
    >
      <div
        className={`${mobile ? "flex items-center justify-between px-6" : "flex items-center gap-2 px-6"} mb-6 pt-8`}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Crown"
            width={80}
            height={36}
            className="mix-blend-screen drop-shadow-[0_0_8px_rgba(201,168,76,0.5)]"
          />
          <Image
            src="/wordmark.svg"
            alt="Elite Glam"
            width={100}
            height={22}
            className="mix-blend-screen drop-shadow-[0_0_6px_rgba(201,168,76,0.3)]"
          />
        </div>
        {mobile && onClose && (
          <button
            type="button"
            className="p-2 text-[#C9A84C] border border-[#C9A84C]/20"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex flex-col flex-1">
        {menuItems.map((item) => {
          const isActive = currentSection === item.param;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={`/admin/dashboard?section=${item.param}`}
              onClick={() => {
                if (mobile && onClose) onClose();
              }}
              className={`flex items-center gap-4 px-6 py-4 transition-all border-l-4 ${
                isActive
                  ? "bg-[#1a170e]/50 border-[#C9A84C] text-[#F5EDD6]"
                  : "border-transparent text-muted-foreground hover:text-[#C9A84C]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[0.7rem] font-bold tracking-[0.2em] uppercase">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 px-6">
        <div className="text-[0.6rem] tracking-[0.25em] text-[#444] mb-4 uppercase">Management</div>
        {managementItems.map((item) => {
          const isActive = currentSection === item.param;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={`/admin/dashboard?section=${item.param}`}
              onClick={() => {
                if (mobile && onClose) onClose();
              }}
              className={`flex items-center gap-4 px-0 py-4 transition-all ${
                isActive ? "text-[#F5EDD6]" : "text-muted-foreground hover:text-[#C9A84C]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[0.7rem] font-bold tracking-[0.2em] uppercase">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
