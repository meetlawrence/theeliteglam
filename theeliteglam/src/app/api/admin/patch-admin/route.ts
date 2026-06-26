import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { JWT } from "../../../../back-end/lib/utils/jwt";
import { adminService } from "../../../../back-end/services/admin-service";

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") as string;
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await JWT.verifyToken(accessToken);
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const result = await adminService.updateAdmin(id, body, payload.role);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}
