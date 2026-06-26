import { DashboardHeader } from "@/app/components/admin/dashboard/DashboardHeader";
import { DashboardStats } from "@/app/components/admin/dashboard/DashboardStats";
import { DashboardMainGrid } from "@/app/components/admin/dashboard/DashboardMainGrid";
import { AdminTaskList } from "@/app/components/admin/AdminTaskList";
import { stats, revenueData, activityData, taskData } from "@/app/components/admin/dashboard/dashboardData";

export function OverviewView() {
  return (
    <div className="space-y-6">
      <DashboardHeader />

      <section className="">
        <DashboardStats stats={stats} />

      </section>
    <DashboardMainGrid revenueData={revenueData} activityData={activityData} />
    <AdminTaskList tasks={taskData} />
    </div>
  );
}
