"use client";

import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  user?: { name?: string; role?: string };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [profile, setProfile] = useState({ name: user?.name ?? "", role: user?.role ?? "" });

  useEffect(() => {
    if (user?.name && user?.role) {
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();

        if (isMounted && res.ok && data?.success && data?.admin) {
          setProfile({
            name: data.admin.name ?? "",
            role: data.admin.role ?? "",
          });
        }
      } catch {
        // Ignore fetch failures and fall back to the passed props.
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.name, user?.role]);

  const formattedRole = profile.role
    ? profile.role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Admin";

  return (
    <section className="border border-[#1a170e] bg-[#080808] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-cinzel text-3xl text-cream tracking-widest leading-tight mb-1">
            Welcome back, {profile.name || "Admin"}!
          </h1>
          <div className="text-[#C9A84C]">{formattedRole}</div>
        </div>
      </div>
    </section>
  );
}
