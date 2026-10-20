export type StatSummary = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

export type Contestant = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  gender: string;
  age: number;
  state: string;
  country?: string;
  tribe?: string;
  occupation?: string;
  height?: number | null;
  weight?: number | null;
  portfolio?: string | null;
  advocacy?: string;
  funFact?: string;
  bio?: string | null;
  stageName?: string | null;
  contestantCategories: string;
  status: string;
}

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
