"use client";

import { useState } from "react";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
import { AdminHeader } from "@/app/components/admin/AdminHeader";
import { AdminFooter } from "@/app/components/admin/AdminFooter";
import type { SidebarLink } from "@/app/components/admin/AdminDashboardTypes";

const ADMIN_LINKS: SidebarLink[] = [
  { label: "Overview", href: "/admin/dashboard", active: true },
  { label: "Contestants", href: "/admin/contestants", active: false },
  { label: "Financials", href: "/admin/financials", active: false },
  { label: "Tickets", href: "/admin/tickets", active: false },
];

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; role?: string };
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={`flex min-h-screen bg-[#050505] ${mobileSidebarOpen ? "overflow-hidden" : ""}`}>
      <AdminSidebar links={ADMIN_LINKS} />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative h-full w-72">
            <AdminSidebar links={ADMIN_LINKS} mobile onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <div className="px-6 py-4 sticky top-0 z-30 bg-[#050505] md:px-10">
          <AdminHeader
            mobileOpen={mobileSidebarOpen}
            onMobileMenuToggle={() => setMobileSidebarOpen((value) => !value)}
            user={user}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">{children}</main>

        <div className="px-6 sticky bottom-0 z-30 bg-[#050505] md:px-10">
          <AdminFooter />
        </div>
      </div>
    </div>
  );
}
