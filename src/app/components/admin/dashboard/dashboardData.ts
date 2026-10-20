import type {
  ActivityItem,
  RevenuePoint,
  StatSummary,
  TaskItem,
} from "@/app/components/admin/AdminDashboardTypes";

export const stats: StatSummary[] = [
  { label: "Ticket Sales", value: "84.2K", change: "+12.4%", trend: "up" },
  { label: "Total Applicants", value: "328", change: "+8.1%", trend: "up" },
  { label: "Pending Reviews", value: "18", change: "-6.3%", trend: "down" },
  { label: "Total Votes", value: "200k", change: "+3.2%", trend: "up" },
  { label: "Revenue", value: "$192.4K", change: "+4.9%", trend: "up" },
];

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
