import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { JWT } from "../utils/jwt";
import { adminRepo } from "../../models/admin-models";

export async function authMiddleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false as const,
      response: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }),
    };
  }

  let payload: Awaited<ReturnType<typeof JWT.verifyAccessToken>>;
  try {
    payload = await JWT.verifyAccessToken(accessToken);
  } catch {
    return {
      success: false as const,
      response: NextResponse.json(
        { success: false, message: "Your session is invalid or has expired. Please sign in again." },
        { status: 401 },
      ),
    };
  }

  let admin: Awaited<ReturnType<typeof adminRepo.findById>>;
  try {
    admin = await adminRepo.findById(payload.adminId);
  } catch (error) {
    console.error("Admin authorization failed while loading the admin account:", error);
    return {
      success: false as const,
      response: NextResponse.json(
        { success: false, message: "Unable to verify admin access." },
        { status: 503 },
      ),
    };
  }

  if (
    !admin ||
    !admin.permitted ||
    (admin.role !== "ADMIN" && admin.role !== "SUPER_ADMIN")
  ) {
    return {
      success: false as const,
      response: NextResponse.json({ success: false, message: "Access denied" }, { status: 403 }),
    };
  }

  return {
    success: true as const,
    payload: { ...payload, role: admin.role },
  };
}
