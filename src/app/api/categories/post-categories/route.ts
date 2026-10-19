import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { categoryService } from "../../../../back-end/services/category-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;

    const body = await req.json();
    const result = await categoryService.createCategory(body, payload.role);

    return NextResponse.json(result, { status: result.status || 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
