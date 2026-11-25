import type { LucideIcon } from "lucide-react";
import { Users, FileText, Eye, Ticket, BarChart3, Banknote } from "lucide-react";
import type { Contestant } from "@/app/components/admin/AdminDashboardTypes";

interface DashboardMetrics {
  revenue: number;
  tickets: number;
  votes: number;
}

interface AdminStatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function AdminStatCard({ label, value, icon: Icon }: AdminStatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-[#0D0D0D] p-5 shadow-lg transition-colors hover:border-[#2a2a2a]">
      <div className="flex justify-between items-start mb-3">
        <Icon className="w-5 h-5 text-[#C9A84C]" />
      </div>
      
      <div className="relative z-10">
        <p className="font-raleway text-[0.9rem] leading-[1.7] text-muted-foreground">{label}</p>
        <h3 className="text-2xl font-serif text-[#F5EDD6]">{value}</h3>
      </div>

      <Icon className="absolute -bottom-3 -right-3 w-16 h-16 text-[#0d0d0d] opacity-50" />
    </div>
  );
}

interface DashboardStatsProps {
  contestants: Contestant[];
  isLoading: boolean;
  hasError: boolean;
  metrics: DashboardMetrics | null;
  metricsError: string;
}

export function DashboardStats({
  contestants,
  isLoading,
  hasError,
  metrics,
  metricsError,
}: DashboardStatsProps) {
  const unavailableValue = isLoading ? "…" : "—";
  const stats = [
    {
      label: "Total Applicants",
      value: isLoading || hasError ? unavailableValue : String(contestants.length),
      icon: Users,
    },
    {
      label: "Pending Reviews",
      value: isLoading || hasError
        ? unavailableValue
        : String(contestants.filter((contestant) => contestant.status.toUpperCase() === "PENDING").length),
      icon: FileText,
    },
    {
      label: "Approved Contestants",
      value: isLoading || hasError
        ? unavailableValue
        : String(contestants.filter((contestant) => contestant.status.toUpperCase() === "ACTIVE").length),
      icon: Eye,
    },
    {
      label: "Revenue",
      value: metrics ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(metrics.revenue) : "—",
      icon: Banknote,
    },
    {
      label: "Tickets Sold",
      value: metrics ? String(metrics.tickets) : "—",
      icon: Ticket,
    },
    {
      label: "Total Votes",
      value: metrics ? String(metrics.votes) : "—",
      icon: BarChart3,
    },
  ];

  return (
    <>
      <div className="mt-10 mb-12 grid gap-6 grid-cols-2 lg:grid-cols-3 items-center justify-center">
        {stats.map((stat) => (
          <AdminStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>
      {metricsError ? (
        <p role="alert" className="mb-6 text-sm text-red-400">
          {metricsError}
        </p>
      ) : null}
    </>
  );
}

export default DashboardStats;