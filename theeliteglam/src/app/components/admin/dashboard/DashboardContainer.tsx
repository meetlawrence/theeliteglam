"use client";

import { useSearchParams } from "next/navigation";
import { OverviewView } from "@/app/components/admin/dashboard/views/OverviewView";
import { ContestantsView } from "@/app/components/admin/dashboard/views/ContestantsView";
import { FinancialsView } from "@/app/components/admin/dashboard/views/FinancialsView";
import { TicketsView } from "@/app/components/admin/dashboard/views/TicketsView";

export function DashboardContainer() {
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "overview";

  const renderView = () => {
    switch (section.toLowerCase()) {
      case "contestants":
        return <ContestantsView />;
      case "financials":
        return <FinancialsView />;
      case "tickets":
        return <TicketsView />;
      case "overview":
      default:
        return <OverviewView />;
    }
  };

  return <div className="space-y-6">{renderView()}</div>;
}
