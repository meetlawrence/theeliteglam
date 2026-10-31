import { NextResponse, type NextRequest } from "next/server";
import { JWT } from "./back-end/lib/utils/jwt";
import { adminRepo } from "./back-end/models/admin-models";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  let payload: Awaited<ReturnType<typeof JWT.verifyAccessToken>>;
  try {
    payload = await JWT.verifyAccessToken(accessToken);
  } catch {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (typeof payload.adminId !== "string" || payload.adminId.length === 0) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  let admin: Awaited<ReturnType<typeof adminRepo.findById>>;
  try {
    admin = await adminRepo.findById(payload.adminId);
  } catch (error) {
    console.error("Dashboard authorization failed while loading the admin account:", error);
    return NextResponse.json(
      { success: false, message: "Unable to verify admin access." },
      { status: 503 },
    );
  }

  if (
    !admin ||
    !admin.permitted ||
    (admin.role !== "ADMIN" &&
      admin.role !== "SUPER_ADMIN" &&
      admin.role !== "TICKETS_VALIDATOR")
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-authenticated-admin-id");
  requestHeaders.set("x-authenticated-admin-id", admin.id);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
