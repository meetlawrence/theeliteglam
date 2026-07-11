import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { JWT } from "../../../../back-end/lib/utils/jwt";
import { adminService } from "../../../../back-end/services/admin-service";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await JWT.verifyToken(accessToken);

    if (!payload || payload.role !== "SUPER_ADMIN" || payload.type !== "ACCESS") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const result = await adminService.getAllAdmins(payload.role);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error || "Invalid token" },
      { status: 401 },
    );
  }
}
