import { NextRequest, NextResponse } from "next/server";
import { eventService } from "../../../../back-end/services/event-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const id = req.nextUrl.searchParams.get("id") as string;

    const body = await req.json();
    const result = await eventService.updateEvent(id, body, payload.role);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}
