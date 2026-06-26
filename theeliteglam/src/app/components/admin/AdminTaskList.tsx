import { TaskItem } from "@/app/components/admin/AdminDashboardTypes";

export function AdminTaskList({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="border border-[#1a170e] bg-[#080808] p-4">
      <div className="mb-5 text-sm uppercase tracking-[0.24em] text-[#9A8C6A]">Action Items</div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="border border-[#1a170e] bg-[#0D0D0D] p-3">
            <div className="flex items-center justify-between gap-3 text-sm text-[#F5EDD6]">
              <span>{task.task}</span>
              <span className="text-xs uppercase tracking-[0.24em] text-[#C9A84C]">{task.status}</span>
            </div>
            <div className="mt-1 text-[0.8rem] text-[#B6AC92]">Due {task.due}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
