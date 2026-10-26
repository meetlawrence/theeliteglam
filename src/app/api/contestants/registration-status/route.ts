import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { paymentModel } from "@/back-end/models/payment-model";
import { contestantModel } from "@/back-end/models/contestant-model";
import { verifyPaymentSchema } from "@/back-end/lib/validation/payment-validation";
import { formatZodError } from "@/back-end/lib/utils/helper";

export async function GET(req: NextRequest) {
  const parsed = verifyPaymentSchema.safeParse({
    reference: req.nextUrl.searchParams.get("reference")?.trim(),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: formatZodError(parsed.error),
      },
      { status: 400 },
    );
  }

  try {
    const { reference } = parsed.data;
    const transaction =
      await paymentModel.findByReference(reference);

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Payment transaction not found." },
        { status: 404 },
      );
    }

    if (transaction.status !== "SUCCESS") {
      return NextResponse.json(
        {
          success: false,
          message:
            "We could not verify a successful payment for this transaction reference.",
        },
        { status: 403 },
      );
    }

    const existingContestant =
      await contestantModel.findByReference(reference);

    if (existingContestant) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This payment reference has already been used to submit an application.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true, eligible: true });
  } catch (error) {
    console.error("[GET /api/contestants/registration-status]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify contestant registration access.",
      },
      { status: 500 },
    );
  }
}
