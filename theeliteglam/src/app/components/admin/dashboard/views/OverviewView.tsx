import { DashboardHeader } from "@/app/components/admin/dashboard/DashboardOverviewHeader";
import { DashboardStats } from "@/app/components/admin/dashboard/DashboardStats";
import { DashboardMainGrid } from "@/app/components/admin/dashboard/DashboardMainGrid";
import { AdminTaskList } from "@/app/components/admin/AdminTaskList";
import {
  stats,
  revenueData,
  activityData,
  taskData,
} from "@/app/components/admin/dashboard/dashboardData";

export function OverviewView({ user }: { user?: { name?: string; role?: string } }) {
  return (
    <div className="space-y-6">
      <DashboardHeader user={user} />

      <section className="">
        <DashboardStats stats={stats} />
      </section>
      <DashboardMainGrid revenueData={revenueData} activityData={activityData} />
      <AdminTaskList tasks={taskData} />
    </div>
  );
}
