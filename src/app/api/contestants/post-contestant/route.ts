
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { contestantService } from "../../../../back-end/services/contestant-service";
import { authMiddleware } from "../../../../back-end/lib/route-middleware/admin";
import { contestantTransactionService } from "@/back-end/services/contestant-transaction-service";

export async function POST(req: NextRequest) {
  try {
    const reference1 = req.nextUrl.searchParams.get("reference");

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
    } = await req.json();

    // =========================================================
    // PAYMENT FLOW
    // POST /api/contestant?reference=PAYSTACK_REFERENCE
    // =========================================================

    if (reference1) {
      // 1. Find the payment transaction
      const transaction =
        await contestantTransactionService.getContestantTransactionByReference(
          reference1,
        );

      // Transaction must exist
      if (!transaction.success || !transaction.data) {
        return NextResponse.json(
          {
            success: false,
            error: "Contestant transaction not found",
          },
          { status: 404 },
        );
      }

      // 2. Payment must be successful
      if (transaction.data.status !== "SUCCESS") {
        return NextResponse.json(
          {
            success: false,
            error: "Payment has not been completed",
          },
          { status: 402 },
        );
      }

      // 3. Prevent duplicate contestant registration
      const contestantExists =
        await contestantService.getContestantByreference(
          transaction.data.reference,
        );

      if (contestantExists.success && contestantExists.data) {
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

        // These come from the verified transaction,
        // NOT from the client request.
        eventId: transaction.data.eventId,
        reference: transaction.data.reference,
      };

      // 5. Create contestant
      const result =
        await contestantService.createContestant(contestantData);

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

    const result = await contestantService.createContestant({
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
    });

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

