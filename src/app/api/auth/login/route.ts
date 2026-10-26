// src/app/api/auth/login/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AUTH_CONFIG } from "../../../../back-end/config/auth";
import { authService } from "../../../../back-end/services/auth-service";
import type { LoginInput } from "../../../../back-end/types/auth-types";

export async function POST(req: NextRequest) {
  try {
    const body: LoginInput = await req.json();

    const result = await authService.login(body);

    if (result.success) {
      const response = NextResponse.json(result, { status: 200 });

      // Set HttpOnly cookies using config
      response.cookies.set("accessToken", result.accessToken!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: AUTH_CONFIG.JWT_ACCESS_EXPIRES_IN_SECONDS,
        path: "/",
      });

      response.cookies.set("refreshToken", result.refreshToken!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: AUTH_CONFIG.JWT_REFRESH_EXPIRES_IN_SECONDS,
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
