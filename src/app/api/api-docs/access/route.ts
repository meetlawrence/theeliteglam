import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import spec from "@/back-end/api-docs/openapi.json";
import { verifyApiDocsAccess } from "@/back-end/lib/route-middleware/supper-admin-access";

export async function GET(request: NextRequest) {
  const access = await verifyApiDocsAccess(
    request.cookies.get("accessToken")?.value,
  );

  if (!access.allowed) {
    return NextResponse.json(
      {
        success: false,
        allowed: false,
        message: access.status === 401 ? "Unauthorized" : "Forbidden",
      },
      {
        status: access.status,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }

  return NextResponse.json(spec, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
