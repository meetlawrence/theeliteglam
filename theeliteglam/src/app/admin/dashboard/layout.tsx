import { cloneElement, isValidElement } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { JWT } from "@/back-end/lib/utils/jwt";
import { adminRepo } from "@/back-end/models/admin-models";
import DashboardClientLayout from "./DashboardClientLayout";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // The Security Guard: If no token, bounce to login
  if (!token) {
    redirect("/admin");
  }

  const payload = await JWT.verifyToken(token);
  if (!payload) {
    redirect("/admin");
  }

  const admin = await adminRepo.findById(payload.adminId);
  if (!admin) {
    redirect("/admin");
  }

  const user = { name: admin.name, role: admin.role };
  const pageWithUser = isValidElement(children)
    ? cloneElement(children, { user })
    : children;

  return (
    <DashboardClientLayout user={user}>
      {pageWithUser}
    </DashboardClientLayout>
  );
}
