import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { paymentService } from "@/back-end/services/payment-services/payment-service";
import { paymentModel } from "@/back-end/models/payment-model";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

/**
 * Verify that the request really came from Paystack
 */
function verifyPaystackSignature(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature || !PAYSTACK_SECRET) return false;

  const hash = createHmac("sha512", PAYSTACK_SECRET)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // 1. Signature verification (mandatory)
    if (!verifyPaystackSignature(rawBody, signature)) {
      console.error("[Webhook] Invalid Paystack signature");
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    // 2. We only care about successful charges
    if (event.event !== "charge.success") {
      return NextResponse.json({ success: true, message: "Ignored event" });
    }

    const reference = event?.data?.reference;

    if (!reference || typeof reference !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing reference" },
        { status: 400 }
      );
    }

    // 3. Load our transaction
    const transaction = await paymentModel.findByReference(reference);

    if (!transaction) {
      // Not one of ours – acknowledge so Paystack stops retrying
      console.warn("[Webhook] Unknown reference:", reference);
      return NextResponse.json({ success: true, message: "Unknown reference" });
    }

    // 4. Already fully processed → idempotent
    if (
      transaction.status === "SUCCESS" &&
      transaction.fulfillmentStatus === "COMPLETED"
    ) {
      return NextResponse.json({
        success: true,
        message: "Already processed",
      });
    }

    // 5. Re-use the same verify + fulfill logic
    const result = await paymentService.verify(reference);

    if (!result.success) {
      console.error("[Webhook] Verification/fulfillment failed:", result.message);
      // Still return 200 so Paystack does not keep retrying forever
      // (you can later add a dead-letter / admin alert)
      return NextResponse.json({
        success: false,
        message: result.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
    });
  } catch (error: any) {
    console.error("[Webhook] Unexpected error:", error);
    // Return 500 so Paystack will retry
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}