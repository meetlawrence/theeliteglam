import "server-only";

import { DashboardContainer } from "@/app/components/admin/dashboard/DashboardContainer";
import { prisma } from "@/back-end/db/db-connect";

export default async function DashboardPage() {
  let metrics:
    | { revenue: number; tickets: number; votes: number }
    | null = null;
  let metricsError = "";

  try {
    const [revenue, tickets, votes] = await Promise.all([
      prisma.paymentTransaction.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
      }),
      prisma.ticket.count(),
      prisma.vote.aggregate({
        _sum: { count: true },
      }),
    ]);

    metrics = {
      revenue: revenue._sum.amount?.toNumber() ?? 0,
      tickets,
      votes: votes._sum.count ?? 0,
    };
  } catch (error) {
    console.error("[DashboardPage] Failed to load overview metrics:", error);
    metricsError = "Unable to load revenue, ticket, and vote totals.";
  }

  return (
    <main>
      <DashboardContainer metrics={metrics} metricsError={metricsError} />
    </main>
  );
}
