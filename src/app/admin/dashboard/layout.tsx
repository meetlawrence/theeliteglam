import { redirect } from "next/navigation";
import { fetchServerApi } from "@/app/lib/server-api";
import DashboardClientLayout from "./DashboardClientLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const response = await fetchServerApi("/api/auth/me", { forwardCookies: true });
  if (response.status === 401 || response.status === 404) {
    redirect("/admin");
  }

  const result: {
    success?: boolean;
    admin?: { name: string; role: string };
    error?: string;
  } = await response.json();
  if (!response.ok || result.success !== true || !result.admin) {
    throw new Error(result.error || "Unable to load the current admin.");
  }

  const user = { name: result.admin.name, role: result.admin.role };

  return (
    <DashboardClientLayout user={user}>
      {children}
    </DashboardClientLayout>
  );
}
