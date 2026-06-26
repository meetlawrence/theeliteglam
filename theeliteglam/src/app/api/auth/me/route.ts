// src/app/api/auth/me/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { JWT } from "../../../../back-end/lib/utils/jwt";
import { adminRepo } from "../../../../back-end/models/admin-models";

/**
 * GET /api/auth/me
 * Returns current logged-in user data
 * Used by Dashboard and other protected pages
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Get access token from HttpOnly cookie
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    // 2. Verify the token
    const payload = await JWT.verifyToken(accessToken);

    // 3. Fetch user from database
    const admin = await adminRepo.findById(payload.adminId);

    if (!admin) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // 4. Return public user data
    return NextResponse.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
