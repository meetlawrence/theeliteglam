import "dotenv/config";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ticketService } from "@/back-end/services/ticket-service";
import { ticketTypeIdSchema, quantitySchema } from "@/back-end/lib/validation/ticket-schema";
import { formatZodError } from "@/back-end/lib/utils/helper";
import { ticketTypeRepo } from "@/back-end/models/ticket-type-models";
import type { PriceValidationResult, QuantityValidationResult } from "@/back-end/types/tickets";

export async function POST(req: NextRequest) {
  try {
    const { email, name, ticketTypeId, quantity, phoneNumber, eventId } = await req.json();
    console.log("Request body:", {
      email,
      name,
      ticketTypeId,
      quantity,
      phoneNumber,
      eventId,
    });

    const priceValidation = async function (id: string) {
      const validation = ticketTypeIdSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400, price: 0 };
      }
      const ticketType = await ticketTypeRepo.findById(validation.data.id);
      if (!ticketType) {
        return { success: false, error: "Ticket type not found", status: 404, price: 0 };
      }
      return { success: true, status: 200, price: ticketType.price };
    };

    const quantityValidation = async function (quantity: number) {
      const validation = quantitySchema.safeParse({ quantity });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      return { success: true, status: 200 };
    };

    const validPrice = await priceValidation(ticketTypeId);
    const validQuantity = await quantityValidation(quantity);

    async function totalTicketPrice(
      pricedata: PriceValidationResult,
      quantityData: QuantityValidationResult,
      quantity: number,
    ) {
      if (pricedata.success === false && quantityData.success === false) {
        const unitPrice = 0;
        const total = 0;
        const paystackAmount = 0;
        return {
          unitPrice,
          total,
          paystackAmount,
        };
      }

      const total = await ticketService.calculateTicketPrice(pricedata.price, quantity);
      return total;
    }
    const amounts = await totalTicketPrice(validPrice, validQuantity, quantity);

    const url = "https://api.paystack.co/transaction/initialize";
    const result = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amounts.paystackAmount,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-payment`,
      }),
    });
    if (!result.ok) {
      const errorResponse = await result;
      console.error("Paystack API Error:", errorResponse);
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 });
    }
    const data = await result.json();
    await ticketService.createTicket({
      email,
      name,
      ticketTypeId,
      quantity,
      reference: data.data.reference,
      phoneNumber,
      total: amounts.total,
      amount: amounts.unitPrice,
      eventId,
    });
    console.log("Paystack API Response 1:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("payment API Error:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
