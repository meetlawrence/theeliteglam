import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { contestantService } from "../../../../back-end/services/contestant-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const id = req.nextUrl.searchParams.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Contestant ID is required" },
        { status: 400 },
      );
    }

    const result = await contestantService.getContestantById(id);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch contestant. Please try again." },
      { status: 404 },
    );
  }
}