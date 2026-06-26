import { ActivityItem } from "@/app/components/admin/AdminDashboardTypes";

export function AdminActivityList({ activity }: { activity: ActivityItem[] }) {
  return (
    <div className="border border-[#1a170e] bg-[#080808] p-4">
      <div className="mb-5 text-sm uppercase tracking-[0.24em] text-[#9A8C6A]">Live Activity</div>
      <div className="space-y-2">
        {activity.map((item) => (
          <div key={item.id} className="border border-[#1a170e] bg-[#0D0D0D] p-3">
            <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-[#C9A84C]">
              <span>{item.time}</span>
              <span>{item.badge}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-[#F5EDD6]">{item.title}</div>
            <div className="mt-1 text-[0.75rem] text-[#B6AC92]">{item.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
