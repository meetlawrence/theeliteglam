import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { JWT } from "../../../../../back-end/lib/utils/jwt";
import { adminService } from "../../../../../back-end/services/admin-service";

interface ProductParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: ProductParams) {
  const { id } = await params;
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    const payload = await JWT.verifyToken(accessToken);
    if (payload && payload.role !== "SUPER_ADMIN" && payload.type !== "ACCESS") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const result = await adminService.getAdminById(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error || "Invalid token" },
      { status: 401 },
    );
  }
}
