import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eventService } from "../../../../back-end/services/event-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const result = await eventService.getAllEvents();
    return NextResponse.json(result, { status: result.status || 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch events. Please try again." },
      { status: 401 },
    );
  }
}
