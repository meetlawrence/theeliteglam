import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { paymentService } from "@/back-end/services/payment-services/payment-service";
import { verifyPaymentSchema } from "@/back-end/lib/validation/payment-validation";
import { formatZodError } from "@/back-end/lib/utils/helper";

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message: "Reference parameter is required",
          status: 400,
        },
        { status: 400 },
      );
    }

    const validation = verifyPaymentSchema.safeParse({ reference });

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

    const result = await paymentService.verify(validation.data.reference);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("[GET /api/payment/verify]", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
        status: 500,
      },
      { status: 500 },
    );
  }
}