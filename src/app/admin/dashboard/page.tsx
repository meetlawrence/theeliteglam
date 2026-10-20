import { DashboardContainer } from "@/app/components/admin/dashboard/DashboardContainer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { JWT } from "@/back-end/lib/utils/jwt";
import { adminRepo } from "@/back-end/models/admin-models";

export default async function DashboardPage() {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    redirect("/admin");
  }

  let adminId: string;
  try {
    const payload = await JWT.verifyAccessToken(accessToken);
    adminId = payload.adminId;
  } catch {
    redirect("/admin");
  }

  const admin = await adminRepo.findById(adminId);
  if (!admin) {
    redirect("/admin");
  }

  const user = { name: admin.name, role: admin.role };

  return (
    <main>
      <DashboardContainer user={user} />
    </main>
  );
}
