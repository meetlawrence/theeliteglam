import { NextRequest, NextResponse } from "next/server";
import { sponsorService } from "../../../../back-end/services/sponsor-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const id = req.nextUrl.searchParams.get("id") as string;

    if (!id) {
      return NextResponse.json({ success: false, message: "Sponsor ID is required" }, { status: 400 });
    }

    const result = await sponsorService.getSponsorById(id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 404 });
  }
}



