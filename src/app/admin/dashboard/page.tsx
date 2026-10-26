import { DashboardContainer } from "@/app/components/admin/dashboard/DashboardContainer";
import { redirect } from "next/navigation";
import { fetchServerApi } from "@/app/lib/server-api";

export default async function DashboardPage() {
  const response = await fetchServerApi("/api/auth/me", { forwardCookies: true });
  if (response.status === 401 || response.status === 404) {
    redirect("/admin");
  }

  const result: {
    success?: boolean;
    admin?: { name: string; role: string };
    message?: string;
  } = await response.json();
  if (!response.ok || result.success !== true || !result.admin) {
    throw new Error(result.message || "Unable to load the current admin.");
  }

  const user = { name: result.admin.name, role: result.admin.role };

  return (
    <main>
      <DashboardContainer user={user} />
    </main>
  );
}
