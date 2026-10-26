import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sponsorService } from "../../../../back-end/services/sponsor-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const body = await req.json();
    const result = await sponsorService.createSponsor(body, payload.role);

    return NextResponse.json(result, { status: result.status || 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create sponsor. Please try again." },
      { status: 404 },
    );
  }
}
