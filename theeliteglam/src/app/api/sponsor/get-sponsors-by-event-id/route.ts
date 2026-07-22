import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sponsorService } from "../../../../back-end/services/sponsor-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const eventId = req.nextUrl.searchParams.get("eventId") as string;

    const result = await sponsorService.getSponsorsByEvent(eventId);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 404 });
  }
}
