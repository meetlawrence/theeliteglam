import "dotenv/config";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { PaystackVerificationResponse } from "@/back-end/types/payment-types";
import type { ContestantTransactionStatus } from "@/back-end/types/contestant-transaction-types";
import { contestantService } from "../../../../back-end/services/contestant-service";
import { contestantTransactionService } from "@/back-end/services/contestant-transaction-service";

export async function GET(req: NextRequest) {
  try {
    // ============================================
    // 1. GET REFERENCE
    // ============================================

    const reference = req.nextUrl.searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment reference is required",
        },
        { status: 400 },
      );
    }

    // ============================================
    // 2. VERIFY PAYMENT WITH PAYSTACK
    // ============================================

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result: PaystackVerificationResponse = await response.json();

    console.log("Paystack verification:", result);

    // ============================================
    // 3. PAYSTACK VERIFICATION FAILED
    // ============================================

    if (!response.ok || !result.status || !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to verify payment",
        },
        { status: 400 },
      );
    }

    // ============================================
    // 4. GET PAYMENT STATUS
    // ============================================

    const status = result.data.status.toUpperCase();

    // ============================================
    // 5. FIND OUR TRANSACTION
    // ============================================

    const transaction =
      await contestantTransactionService.getContestantTransactionByReference(reference);

    if (!transaction.success || !transaction.data) {
      return NextResponse.json(
        {
          success: false,
          error: "Contestant transaction not found",
        },
        { status: 404 },
      );
    }

    // ============================================
    // 6. VERIFY AMOUNT
    // ============================================

    const expectedAmount = Number(transaction.data.amount) * 100;
    const paidAmount = Number(result.data.amount);

    if (paidAmount < expectedAmount) {
      console.error("Payment amount is less than expected:", {
        reference,
        expectedAmount,
        paidAmount,
      });

      await contestantTransactionService.updateContestantTransaction(reference, {
        status: "FAILED",
      });

      return NextResponse.json(
        {
          success: false,
          error: "Payment amount does not match the required amount",
        },
        { status: 400 },
      );
    }

    // ============================================
    // 7. UPDATE TRANSACTION STATUS
    // ============================================

    const update = await contestantTransactionService.updateContestantTransaction(reference, {
      status: status as ContestantTransactionStatus,
    });

    console.log("Updating transaction:", reference, status);

    if (!update.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment verified but transaction update failed",
        },
        { status: 500 },
      );
    }

    // ============================================
    // 8. PAYMENT SUCCESSFUL -> DISPATCH FORM LINK
    // ============================================

    if (status === "SUCCESS") {
      const formEmailResult = await contestantService
        .resendContestantFormLink(reference)
        .catch((err) => {
          console.error("Failed to send contestant email:", err);
          return null;
        });

      return NextResponse.json(
        {
          success: true,
          message: "Contestant payment verified successfully and form link dispatched",
          reference,
          status,
          emailResult: formEmailResult,
          data: update.data,
        },
        { status: 200 },
      );
    }

    // ============================================
    // 9. PAYMENT NOT SUCCESSFUL
    // ============================================

    return NextResponse.json(
      {
        success: false,
        message: `Payment status: ${status}`,
        reference,
        status,
        data: update.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contestant payment verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}