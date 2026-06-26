import { LucideIcon, DollarSign, Users, FileText, Eye, BarChart3, Ticket } from "lucide-react";
import type { StatSummary } from "@/app/components/admin/AdminDashboardTypes";

interface AdminStatCardProps {
  label: string;
  value: string;
  badge?: string;
  icon?: LucideIcon | null;
  badgeColor?: "green" | "gold" | "neutral";
}

export function AdminStatCard({ label, value, badge, icon: Icon, badgeColor = "neutral" }: AdminStatCardProps) {
  return (
    <div className="relative overflow-hidden border border-[#1a170e] bg-[#080808] p-4">
      {/* Top Section: Icon & Badge */}
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-[#151410] border border-[#222]">
          {Icon ? <Icon className="w-5 h-5 text-[#C9A84C]" /> : <div className="w-5 h-5" />}
        </div>
        {badge && (
          <span className={`text-[0.6rem] px-2 py-1 uppercase tracking-widest ${
            badgeColor === "green" ? "text-[#4ade80] bg-[#4ade80]/10" : "text-[#9A8C6A] bg-[#1a170e]"
          }`}>
            {badge}
          </span>
        )}
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

export function DashboardStats({ stats }: { stats: StatSummary[] }) {
  const iconFor = (label: string): LucideIcon | null => {
    const l = label.toLowerCase();
    if (l.includes("ticket")) return Ticket;
    if (l.includes("sales") || l.includes("revenue")) return DollarSign;
    if (l.includes("applicant") || l.includes("applicants") || l.includes("users")) return Users;
    if (l.includes("pending") || l.includes("reviews")) return FileText;
    if (l.includes("votes") || l.includes("voters")) return BarChart3;
    
    return null;
  };

  return (
    <div className="grid gap-4 md:grid-cols-5 justify-between">
      {stats.map((s) => (
        <AdminStatCard
          key={s.label}
          label={s.label}
          value={s.value}
          badge={s.change}
          badgeColor={s.trend === "up" ? "green" : "neutral"}
          icon={iconFor(s.label)}
        />
      ))}
    </div>
  );
}