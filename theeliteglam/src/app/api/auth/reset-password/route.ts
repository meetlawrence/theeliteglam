// src/app/api/auth/reset-password/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authService } from "../../../../back-end/services/auth-service";
import type { ResetPassword } from "../../../../back-end/types/auth-types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get token from query string
    const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Missing token parameter" },
        { status: 400 },
      );
    }

    const data = {
      token,
      newPassword: body.password,
      confirmPassword: body.confirmPassword,
    };
    console.log(data);

    const result = await authService.resetPassword(data);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset password." },
      { status: 500 },
    );
  }
}
