// src/app/api/payment/verify/route.ts
import "dotenv/config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { PaystackVerificationResponse } from "@/back-end/types/payment-types";
import type { TicketTransactionStatus } from "@/back-end/types/tickets-transaction";
import { ticketTransactionService } from "@/back-end/services/ticket-transaction-service";
import { ticketService } from "@/back-end/services/ticket-service";

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "Reference is required" },
        { status: 400 }
      );
    }

    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const result: PaystackVerificationResponse = await response.json();

    console.log("respons", response)
    if (!result.status || !result.data) {
      return NextResponse.json(
        { success: false, message: "Failed to verify payment" },
        { status: 400 }
      );
    }

    const status = result.data.status.toUpperCase() as TicketTransactionStatus;

    // Update ticket status
    const update = await ticketTransactionService.updateTicketTransaction(reference, { status });

    // Only send the ticket email when payment is successful
    if (status === "SUCCESS") {
      // We don't await this so the response is fast
      // (email sending can take a few seconds)
      const ticket  = await ticketService.createTicket(reference).catch((err) => {
        console.error("Failed to send ticket email:", err);
      });
      return NextResponse.json(ticket);
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}