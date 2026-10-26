import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { contestantService } from "../../../../back-end/services/contestant-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

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
        { success: false, message: "Contestant ID is required" },
        { status: 400 },
      );
    }

    const result = await contestantService.deleteContestant(id, payload.role);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete contestant. Please try again." },
      { status: 400 },
    );
  }
}