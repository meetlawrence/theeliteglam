import { NextRequest, NextResponse } from "next/server";
import { eventService } from "../../../../back-end/services/event-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response; // Return error response
    }

    const { payload } = authResult;

    const id = req.nextUrl.searchParams.get("id") as string;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 },
      );
    }

    const result = await eventService.deleteEvent(id, payload.role);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}
