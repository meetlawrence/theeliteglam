import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { contestantService } from "../../../../back-end/services/contestant-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await req.json();
    const result = await contestantService.createContestant(body);

    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error }, { status: 400 });
  }
}
