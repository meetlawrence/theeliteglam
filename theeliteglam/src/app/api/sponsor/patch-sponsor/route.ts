import { NextRequest, NextResponse } from "next/server";
import { sponsorService } from "../../../../back-end/services/sponsor-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const id = req.nextUrl.searchParams.get("id") as string;
    if (!id) {
      return NextResponse.json({ success: false, message: "Sponsor ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const result = await sponsorService.updateSponsor(id, body, payload.role);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}