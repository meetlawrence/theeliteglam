import { redirect } from "next/navigation";
import { getDashboardAdmin } from "@/app/lib/server-admin";
import DashboardClientLayout from "./DashboardClientLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const admin = await getDashboardAdmin();
  if (!admin) {
    redirect("/admin");
  }

  const user = { name: admin.name, role: admin.role };

  return (
    <DashboardClientLayout user={user}>
      {children}
    </DashboardClientLayout>
  );
}
