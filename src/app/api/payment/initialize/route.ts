// src/app/api/payments/initialize/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { paymentService } from "@/back-end/services/payment-services/payment-service";
import { initializePaymentSchema } from "@/back-end/lib/validation/payment-validation";
import { formatZodError } from "@/back-end/lib/utils/helper";
import {
  validateIdempotencyKey,
  claimIdempotencyKey,
  getIdempotentResponse,
  completeIdempotentResponse,
} from "@/back-end/lib/utils/idempotency";

export async function POST(req: NextRequest) {
  try {
    // 1. Require & validate Idempotency-Key

    const rawKey = req.headers.get("Idempotency-Key");
    //*||`test-key-${randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`*/;

    const idempotencyKey = validateIdempotencyKey(rawKey);

    if (!idempotencyKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid Idempotency-Key header is required (8–128 characters)",
          status: 400,
        },
        { status: 400 },
      );
    }

    // 2. Validate body
    const body = await req.json();
    const validation = initializePaymentSchema.safeParse(body);

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

    // 3. Try to claim the key
    const claim = await claimIdempotencyKey({
      key: idempotencyKey,
      method: "POST",
      path: "/api/payments/initialize",
    });

    // 4. If not claimed → another request already owns it
    if (!claim.claimed) {
      // Wait a short time for the other request to finish
      for (let i = 0; i < 15; i++) {
        const existing = await getIdempotentResponse(idempotencyKey);

        if (existing && !existing.pending) {
          return NextResponse.json(existing.response, {
            status: existing.statusCode,
          });
        }

        await new Promise((r) => setTimeout(r, 100));
      }

      return NextResponse.json(
        {
          success: false,
          message: "Request is still processing. Please retry shortly.",
          status: 409,
        },
        { status: 409 },
      );
    }

    // 5. We own the key → process the payment
    const result = await paymentService.initialize(validation.data);

    // 6. Store the final response
    await completeIdempotentResponse({
      key: idempotencyKey,
      statusCode: result.status,
      response: result,
    });

    return NextResponse.json(result, { status: result.status });
  } catch (error: unknown) {
    console.error("[POST /api/payments/initialize]", error);
    return NextResponse.json(
      {
        success: false,
        message: "We couldn't start your payment. Please try again.",
        status: 500,
      },
      { status: 500 },
    );
  }
}
