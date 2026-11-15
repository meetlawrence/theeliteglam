"use client";

import { useSearchParams } from "next/navigation";
import { OverviewView } from "@/app/components/admin/dashboard/views/OverviewView";
import { ContestantsView } from "@/app/components/admin/dashboard/views/ContestantsView";
import { FinancialsView } from "@/app/components/admin/dashboard/views/FinancialsView";
import { TicketsView } from "@/app/components/admin/dashboard/views/TicketsView";
import { SettingsView } from "@/app/components/admin/dashboard/views/SettingsView";

interface DashboardMetrics {
  revenue: number;
  tickets: number;
  votes: number;
}

interface DashboardContainerProps {
  user?: { name?: string; role?: string };
  metrics: DashboardMetrics | null;
  metricsError: string;
}

export function DashboardContainer({
  user,
  metrics,
  metricsError,
}: DashboardContainerProps) {
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
      case "settings":
        return <SettingsView />;
      case "overview":
      default:
        return (
          <OverviewView
            user={user}
            metrics={metrics}
            metricsError={metricsError}
          />
        );
    }
  };

  return <div className="space-y-6">{renderView()}</div>;
}
