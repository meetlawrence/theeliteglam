import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { categoryService } from "../../../../back-end/services/category-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const id = req.nextUrl.searchParams.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required" },
        { status: 400 },
      );
    }

    const result = await categoryService.getCategoryById(id);
    return NextResponse.json(result, { status: result.status || 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 404 });
  }
}
