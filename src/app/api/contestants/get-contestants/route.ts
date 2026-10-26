import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { contestantService } from "../../../../back-end/services/contestant-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    {/*const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }*/}

    const result = await contestantService.getAllContestants();
    return NextResponse.json(result, { status: result.status || 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch contestants. Please try again." },
      { status: 400 },
    );
  }
}