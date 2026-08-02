import "dotenv/config";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { contestantTransactionService } from "@/back-end/services/contestant-transaction-service";
import { eventIdSchema } from "@/back-end/lib/validation/contestant-validation";
import { formatZodError } from "@/back-end/lib/utils/helper";
import { eventModel } from "@/back-end/models/event-model";

export async function POST(req: NextRequest) {
  try {
    const { email, name, phoneNumber, eventId } = await req.json();

    // ============================================
    // 1. BASIC INPUT VALIDATION
    // ============================================

    if (!email || !name || !eventId || !phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, name, phone number and eventId are required",
        },
        { status: 400 }
      );
    }

    // ============================================
    // 2. VALIDATE EVENT ID
    // ============================================

    const validation = eventIdSchema.safeParse({
      eventId,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: formatZodError(validation.error),
        },
        { status: 400 }
      );
    }

    // ============================================
    // 3. FIND EVENT
    // ============================================

    const event = await eventModel.findById(validation.data.eventId);

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: "Event not found",
        },
        { status: 404 }
      );
    }

    // ============================================
    // 4. GET CONTESTANT FEE
    // ============================================

    const contestantFee = event.contestantFee;

    if (!contestantFee || contestantFee <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid contestant registration fee",
        },
        { status: 400 }
      );
    }

    // ============================================
    // 5. CALCULATE PAYMENT
    // ============================================

    const amounts =
      await contestantTransactionService.calculatePrice(contestantFee);

    /*
      amounts should look like:

      {
        unitPrice: 50000,
        paystackAmount: 5000000
      }

      Paystack expects kobo.
    */

    // ============================================
    // 6. INITIALIZE PAYSTACK
    // ============================================

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amounts.paystackAmount,

          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/components/verify-payment`,
        }),
      }
    );

    const data = await response.json();

    console.log("Paystack initialize response:", data);

    if (!response.ok || !data.status || !data.data) {
      console.error("Paystack initialization failed:", data);

      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to initialize payment",
        },
        { status: 500 }
      );
    }

    // ============================================
    // 7. SAVE TRANSACTION
    // ============================================

    const transaction =
      await contestantTransactionService.createContestantTransaction({
        email,
        name,
        phoneNumber,
        eventId: validation.data.eventId,
        reference: data.data.reference,
        amount: amounts.unitPrice,
      });

    if (!transaction.success) {
      console.error(
        "Failed to create contestant transaction:",
        transaction
      );

      return NextResponse.json(
        {
          success: false,
          error: "Payment initialized but transaction could not be saved",
        },
        { status: 500 }
      );
    }

    // ============================================
    // 8. RETURN PAYSTACK RESPONSE
    // ============================================

    return NextResponse.json(
      {
        success: true,
        message: "Payment initialized successfully",
        data: {
          authorization_url: data.data.authorization_url,
          access_code: data.data.access_code,
          reference: data.data.reference,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contestant payment initialization error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}