import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eventService } from "../../../../back-end/services/event-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const body = await req.json();
    const result = await eventService.createEvent(body, payload.role);

    return NextResponse.json(result, { status: result.status || 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create event. Please try again." },
      { status: 400 },
    );
  }
}
