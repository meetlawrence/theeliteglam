export type StatSummary = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export type ActivityItem = {
  id: string;
  time: string;
  title: string;
  details: string;
  badge: string;
};

export type RevenuePoint = {
  label: string;
  value: number;
};

export type TaskItem = {
  id: string;
  task: string;
  due: string;
  status: "Pending" | "In Progress" | "Completed";
};

export type SidebarLink = {
  label: string;
  href: string;
  active?: boolean;
};
