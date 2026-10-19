import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ticketTypeService } from "@/back-end/services/ticket-types-service";
import { authMiddleware } from "@/back-end/lib/route-middleware/admin";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const body = await req.json();
    const result = await ticketTypeService.createTicketType(body, payload.role);

    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 404 });
  }
}
