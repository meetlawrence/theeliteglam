import type {
  ActivityItem,
  RevenuePoint,
  TaskItem,
} from "@/app/components/admin/AdminDashboardTypes";

export const revenueData: RevenuePoint[] = [
  { label: "Week 1", value: 22750 },
  { label: "Week 2", value: 32040 },
  { label: "Week 3", value: 28910 },
  { label: "Week 4", value: 35780 },
];

export const activityData: ActivityItem[] = [
  {
    id: "activity-1",
    time: "10:24 AM",
    title: "Contestant profile updated",
    details: "Profile media and biography content were refreshed.",
    badge: "Contestants",
  },
  {
    id: "activity-2",
    time: "9:18 AM",
    title: "New event created",
    details: "Final gala schedule added to the events calendar.",
    badge: "Events",
  },
  {
    id: "activity-3",
    time: "Yesterday",
    title: "Payment batch approved",
    details: "Finance team approved 24 payout requests.",
    badge: "Finance",
  },
];

export const taskData: TaskItem[] = [
  { id: "task-1", task: "Review new contestant submissions", due: "Today", status: "In Progress" },
  { id: "task-2", task: "Confirm venue catering details", due: "Tomorrow", status: "Pending" },
  { id: "task-3", task: "Publish event recap draft", due: "Friday", status: "Pending" },
];
