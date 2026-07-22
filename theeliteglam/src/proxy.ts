// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWT } from "./back-end/lib/utils/jwt";
import { tokenRepo } from "./back-end/models/token-models";
import { adminRepo } from "./back-end/models/admin-models";
import type { AuthenticatedRequest } from "./back-end/types/token-types";
import { AUTH_CONFIG } from "./back-end/config/auth";

const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/auth/verify-email"];
const protectedRoute = ["/dashboard"];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const isProtectedRoute = protectedRoute.includes(path);

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // ====================== PROTECTED ROUTES ======================
  if (isProtectedRoute) {
    // If user has neither token → definitely send to login
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Try Access Token First
    if (accessToken) {
      try {
        const payload = await JWT.verifyToken(accessToken);
        (req as AuthenticatedRequest).admin = payload;
        return NextResponse.next();
      } catch (e: any) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid or expired token.",
            error: e.message,
          },
          { status: 401 }
        );
      }
    }

    // Try Refresh Token
    if (refreshToken) {
      try {
        const tokenRecord = await tokenRepo.findRefreshToken(refreshToken);

        if (!tokenRecord || tokenRecord.revoked) {
          return NextResponse.redirect(new URL("/auth/login", req.url)); // Fixed: was relative path
        }

        if (new Date(tokenRecord.expiresAt) < new Date()) {
          await tokenRepo.revokeRefreshToken(refreshToken);
          return NextResponse.redirect(new URL("/auth/login", req.url)); // Fixed: was relative path
        }

        const admin = await adminRepo.findById(tokenRecord.adminId);
        if (!admin) {
          return NextResponse.redirect(new URL("/auth/login", req.url)); // Fixed: was relative path
        }

        // Generate new Access Token
        const newAccessToken = await JWT.signAccessToken({
          adminId: admin.id,
          email: admin.email,
          role: admin.role,
          type: "ACCESS",
        });

        // === Refresh Token Rotation (Security Best Practice) ===
        const newRefreshToken = await JWT.signRefreshToken({
          adminId: admin.id,
          email: admin.email,
          role: admin.role,
          type: "REFRESH",
        });

        // Revoke old refresh token
        await tokenRepo.revokeRefreshToken(refreshToken);

        // Save new refresh token
        await tokenRepo.createRefreshToken(
          admin.id,
          newRefreshToken,
          new Date(Date.now() + AUTH_CONFIG.JWT_REFRESH_EXPIRES_IN_SECONDS)
        );

        // Send response with new cookies
        const response = NextResponse.next();

        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: AUTH_CONFIG.JWT_ACCESS_EXPIRES_IN_SECONDS, // Use config
          path: "/",
        });

        response.cookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: AUTH_CONFIG.JWT_REFRESH_EXPIRES_IN_SECONDS, // Use config
          path: "/",
        });

        return response;
      } catch {
        return NextResponse.redirect(new URL("/auth/login", req.url)); // Fixed: was relative path
      }
    }

    // If we reach here, refresh also failed
    return NextResponse.redirect(new URL("/auth/login", req.url)); // Fixed: was relative path
  }

  // ====================== PUBLIC ROUTES ======================
  if (isPublicRoute && accessToken) {
    try {
      if (path === "/" || path === "/login" || path === "/signup") {
        return NextResponse.redirect(new URL("/dashboard", req.url)); // Fixed: was relative path
      }
      return NextResponse.next();
    } catch {
      // Invalid token, allow access to auth pages
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Matcher
export const matcherConfig = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/login",
    "/signup",
    "/forgot-password",
    "/auth/verify-email",
  ],
};
