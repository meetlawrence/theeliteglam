import "server-only";

import { headers } from "next/headers";
import { adminRepo } from "@/back-end/models/admin-models";

export async function getDashboardAdmin() {
  // Proxy overwrites this header only after validating the dashboard request.
  const adminId = (await headers()).get("x-authenticated-admin-id");
  if (!adminId) {
    return null;
  }

  return adminRepo.findById(adminId);
}
