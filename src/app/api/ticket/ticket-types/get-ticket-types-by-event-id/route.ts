import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ticketTypeService } from "@/back-end/services/ticket-types-service";
import { authMiddleware } from "@/back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const eventId = req.nextUrl.searchParams.get("eventId") as string;

    const result = await ticketTypeService.getTicketTypesByEventId(eventId);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 404 });
  }
}
