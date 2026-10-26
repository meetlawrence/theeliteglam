import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { paymentService } from "@/back-end/services/payment-services/payment-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response;
    }

    const { payload } = authResult;
    if (!["ADMIN", "SUPER_ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { success: false, message: "Access denied.", status: 403 },
        { status: 403 },
      );
    }

    const result = await paymentService.listFailedFulfillments();
    return NextResponse.json(result, { status: result.status });
  } catch (error: unknown) {
    console.error("[GET /api/admin/payments/failed-fulfillments]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch payment fulfillments. Please try again.",
        status: 500,
      },
      { status: 500 },
    );
  }
}
