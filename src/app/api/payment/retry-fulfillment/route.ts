import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { formatZodError } from "@/back-end/lib/utils/helper";
import { paymentService } from "@/back-end/services/payment-services/payment-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";

const bodySchema = z.object({
  reference: z.string().trim().min(8).max(100),
});

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const validation = bodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        },
        { status: 400 },
      );
    }

    const result = await paymentService.retryFulfillment(validation.data.reference);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[POST /api/admin/payments/retry-fulfillment]", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error",
        status: 500,
      },
      { status: 500 },
    );
  }
}
