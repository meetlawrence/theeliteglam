import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ticketTypeService } from "@/back-end/services/ticket-types-service";
import { authMiddleware } from "@/back-end/lib/route-middleware/admin";

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const id = req.nextUrl.searchParams.get("id") as string;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Sponsor ID is required" },
        { status: 400 },
      );
    }

    const result = await ticketTypeService.deleteTicketTypet(id, payload.role);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete ticket type. Please try again." },
      { status: 404 },
    );
  }
}
