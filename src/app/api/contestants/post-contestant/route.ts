
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { contestantService } from "../../../../back-end/services/contestant-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";
import { paymentModel } from "@/back-end/models/payment-model";

export async function POST(req: NextRequest) {
  try {
    const paymentReference = req.nextUrl.searchParams.get("reference");

    const {
      name,
      email,
      gender,
      image,
      stageName,
      height,
      weight,
      bio,
      portfolio,
      phone,
      age,
      state,
      country,
      occupation,
      advocacy,
      funFact,
      tribe,
      contestantCategories,
      eventId,
      reference,
      paymentTransactionId,
    } = await req.json();
    

    // =========================================================
    // PAYMENT FLOW
    // POST /api/contestant?reference=PAYSTACK_REFERENCE
    // =========================================================

    if (paymentReference) {
      const transaction = await paymentModel.findByReference(paymentReference);

      if (!transaction || transaction.purpose !== "CONTESTANT") {
        return NextResponse.json(
          {
            success: false,
            error: "Contestant payment transaction not found",
          },
          { status: 404 },
        );
      }

      if (transaction.status !== "SUCCESS") {
        return NextResponse.json(
          {
            success: false,
            error: "Payment has not been completed",
          },
          { status: 402 },
        );
      }

      if (transaction.contestant) {
        return NextResponse.json(
          {
            success: false,
            error: "Contestant already exists",
          },
          { status: 409 },
        );
      }

      // 4. Build contestant data using TRUSTED transaction values
      const contestantData = {
        name,
        email,
        gender,
        image,
        stageName,
        height,
        weight,
        bio,
        portfolio,
        phone,
        age,
        state,
        country,
        occupation,
        advocacy,
        funFact,
        tribe,
        contestantCategories,
        eventId: transaction.eventId,
        reference: transaction.reference,
        paymentTransactionId: transaction.id,
      };

      const result = await contestantService.createContestant(
        contestantData,
        transaction.reference,
      );

      return NextResponse.json(result, {
        status: result.status || 200,
      });
    }

    // =========================================================
    // ADMIN FLOW
    // POST /api/contestant
    // =========================================================

    const authResult = await authMiddleware(req);

    if (!authResult.success) {
      return authResult.response;
    }

    const result = await contestantService.createContestant(
      {
        name,
        email,
        gender,
        image,
        stageName,
        height,
        weight,
        bio,
        portfolio,
        phone,
        age,
        state,
        country,
        occupation,
        advocacy,
        funFact,
        tribe,
        contestantCategories,
        eventId,
        reference,
        paymentTransactionId,
      },
      reference,
    );

    return NextResponse.json(result, {
      status: result.status || 200,
    });
  } catch (error) {
    console.error("Create contestant error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
