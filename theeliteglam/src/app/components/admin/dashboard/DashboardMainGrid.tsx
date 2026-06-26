import { AdminRevenuePanel } from "@/app/components/admin/AdminRevenuePanel";
import { AdminActivityList } from "@/app/components/admin/AdminActivityList";
import type { ActivityItem, RevenuePoint } from "@/app/components/admin/AdminDashboardTypes";

export function DashboardMainGrid({ revenueData, activityData }: { revenueData: RevenuePoint[]; activityData: ActivityItem[] }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <AdminRevenuePanel data={revenueData} />
      <AdminActivityList activity={activityData} />
    </section>
  );
}
