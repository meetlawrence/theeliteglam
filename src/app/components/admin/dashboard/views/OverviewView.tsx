"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/app/components/admin/dashboard/DashboardOverviewHeader";
import { DashboardStats } from "@/app/components/admin/dashboard/DashboardStats";
import { DashboardMainGrid } from "@/app/components/admin/dashboard/DashboardMainGrid";
import type { Contestant } from "@/app/components/admin/AdminDashboardTypes";
import { stats } from "@/app/components/admin/dashboard/dashboardData";

type ContestantsResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

function isContestant(value: unknown): value is Contestant {
  if (!value || typeof value !== "object") return false;

  const contestant = value as Record<string, unknown>;
  return (
    typeof contestant.id === "string" &&
    typeof contestant.name === "string" &&
    typeof contestant.email === "string" &&
    typeof contestant.gender === "string" &&
    typeof contestant.age === "number" &&
    typeof contestant.state === "string" &&
    typeof contestant.contestantCategories === "string" &&
    typeof contestant.status === "string" &&
    (typeof contestant.image === "string" || contestant.image === null)
  );
}

export function OverviewView({ user }: { user?: { name?: string; role?: string } }) {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadContestants = async () => {
      try {
        const response = await fetch("/api/contestants/get-contestants", {
          cache: "no-store",
        });
        const result: ContestantsResponse = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Unable to load contestants.");
        }
        if (!Array.isArray(result.data) || !result.data.every(isContestant)) {
          throw new Error("The contestants API returned an invalid response.");
        }

        if (isActive) setContestants(result.data);
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load contestants.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadContestants();
    return () => {
      isActive = false;
    };
  }, []);

  const overviewStats = stats.map((stat) =>
    stat.label === "Total Applicants"
      ? { ...stat, value: String(contestants.length) }
      : stat,
  );

  return (
    <div className="space-y-6">
      <DashboardHeader user={user} />

      <section className="">
        <DashboardStats stats={overviewStats} contestants={contestants} />
      </section>
      <DashboardMainGrid
        contestants={contestants}
        isLoading={isLoading}
        error={loadError}
        onContestantUpdated={(updatedContestant) =>
          setContestants((current) =>
            current.map((contestant) =>
              contestant.id === updatedContestant.id
                ? updatedContestant
                : contestant,
            ),
          )
        }
      />
    </div>
  );
}
