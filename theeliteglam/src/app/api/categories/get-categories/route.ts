import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "../../../../back-end/services/category-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const eventId = req.nextUrl.searchParams.get("eventId") as string;

    if (!eventId) {
      return NextResponse.json({ success: false, message: "eventId is required" }, { status: 400 });
    }

    const result = await categoryService.getCategoriesByEvent(eventId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 401 });
  }
}
