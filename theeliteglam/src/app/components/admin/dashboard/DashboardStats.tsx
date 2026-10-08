import type { LucideIcon } from "lucide-react";
import { DollarSign, Users, FileText, Eye, BarChart3, Ticket } from "lucide-react";
import type { StatSummary, Contestant } from "@/app/components/admin/AdminDashboardTypes";

interface AdminStatCardProps {
  label: string;
  value: string;
  badge?: string;
  icon?: LucideIcon | null;
  badgeColor?: "green" | "gold" | "neutral";
}

export function AdminStatCard({
  label,
  value,
  icon: Icon,
  badgeColor = "neutral",
}: AdminStatCardProps) {
  return (
    <div className="relative overflow-hidden border border-[#1a170e] bg-[#080808] p-4">
      {/* Top Section: Icon & Badge */}
      <div className="flex justify-between items-start mb-3">
        {Icon ? <Icon className="w-5 h-5 text-[#C9A84C]" /> : <div className="w-5 h-5" />}
      </div>

      {/* Main Stats */}
      <div className="relative z-10">
        <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[#9A8C6A] mb-0.5">{label}</p>
        <h3 className="text-2xl font-serif text-[#F5EDD6]">{value}</h3>
      </div>

      {/* Background Watermark Icon (Absolute Positioned) */}
      {Icon && <Icon className="absolute -bottom-3 -right-3 w-16 h-16 text-[#0d0d0d] opacity-50" />}
    </div>
  );
}

interface DashboardStatsProps {
  stats: StatSummary[];
  contestants: Contestant[];
}

export function DashboardStats({ stats, contestants }: DashboardStatsProps) {
  const iconFor = (label: string): LucideIcon | null => {
    const l = label.toLowerCase();
    if (l.includes("ticket")) return Ticket;
    if (l.includes("sales") || l.includes("revenue")) return DollarSign;
    if (l.includes("applicant") || l.includes("applicants") || l.includes("users")) return Users;
    if (l.includes("pending") || l.includes("review")) return FileText;
    if (l.includes("votes") || l.includes("voters")) return BarChart3;

    return null;
  };

  const processedStats = stats.map((stat) => {
    const l = stat.label.toLowerCase();
    if (l.includes("pending") || l.includes("review")) {
      const pendingCount = contestants.filter(
        (contestant) => contestant.status.toUpperCase() === "PENDING",
      ).length;

      return {
        ...stat,
        value: pendingCount.toString(),
      };
    }
    return stat;
  });

  return (
    <div className="mt-10 mb-12 grid gap-6 grid-cols-2 lg:grid-cols-5 items-center justify-center">
      {processedStats.map((s) => (
        <AdminStatCard
          key={s.label}
          label={s.label}
          value={s.value}
          badge={s.change}
          icon={iconFor(s.label)}
        />
      ))}
    </div>
  );
}

export default DashboardStats;