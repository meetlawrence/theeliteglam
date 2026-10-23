import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { formatZodError } from "@/back-end/lib/utils/helper";
import { paymentModel } from "@/back-end/models/payment-model";
import { ticketService } from "@/back-end/services/ticket-service";
import { contestantService } from "@/back-end/services/contestant-service";

const bodySchema = z.object({
  reference: z.string().trim().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = bodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        },
        { status: 400 }
      );
    }

    const { reference } = validation.data;

    const payment = await paymentModel.findByReference(reference);

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment record not found",
          status: 404,
        },
        { status: 404 }
      );
    }

    if (payment.status !== "SUCCESS") {
      return NextResponse.json(
        {
          success: false,
          message: "Payment has not been completed yet",
          status: 400,
        },
        { status: 400 }
      );
    }

    if (payment.purpose === "TICKET") {
      const result = await ticketService.resendTicketEmail(reference);
      return NextResponse.json(result, { status: result.status });
    }

    if (payment.purpose === "CONTESTANT") {
      const result = await contestantService.resendContestantFormLink(reference);
      return NextResponse.json(result, { status: result.status });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unknown payment purpose",
        status: 400,
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[POST /api/payments/resend-email]", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error",
        status: 500,
      },
      { status: 500 }
    );
  }
}