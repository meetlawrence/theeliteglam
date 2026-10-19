import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { JWT } from "../utils/jwt";

export async function authMiddleware(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return {
        success: false as const,
        response: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }),
      };
    }

    const payload = await JWT.verifyToken(accessToken);

    if (
      !payload ||
      (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN") ||
      payload.type !== "ACCESS"
    ) {
      return {
        success: false as const,
        response: NextResponse.json({ success: false, message: "Access denied" }, { status: 403 }),
      };
    }

    return {
      success: true as const,
      payload,
    };
  } catch (error) {
    return {
      success: false as const,
      response: NextResponse.json(
        { success: false, message: error || "Invalid or expired token" },
        { status: 401 },
      ),
    };
  }
}
