import "dotenv/config";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { PaystackVerificationResponse } from "@/back-end/types/payment-types";
import type { TicketStatus } from "@/back-end/types/tickets";
import { ticketService } from "@/back-end/services/ticket-service";

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get("reference") as string;

    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const data = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "content-type": "application/json",
      },
    });

    const result: PaystackVerificationResponse = await data.json();

    if (
      result.status &&
      [
        "ABANDONED",
        "FAILED",
        "ONGOING",
        "PENDING",
        "PROCESSING",
        "QUEUED",
        "REVERSED",
        "SUCCESS",
      ].includes(result.data.status.toUpperCase())
    ) {
      const status = result.data.status.toUpperCase() as TicketStatus;
      const update = await ticketService.updateTicket(reference, {
        status,
      });

      if (result.data.status.toUpperCase() === "SUCCESS") {
      }
      return NextResponse.json(update);
    }

    return NextResponse.json({ Message: "Failed to verify payment" }, { status: 500 });
  } catch (error) {
    console.error("payment API Error:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
