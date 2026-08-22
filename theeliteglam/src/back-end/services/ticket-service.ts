import { ticketModel } from "@/back-end/models/ticket-model";
import { prisma } from "@/back-end/database/db-connect";
import QRCode from "qrcode";
import { sendEmail } from "@/back-end/lib/email/resend";
import { uploadQRCode } from "@/back-end/database/cloudinary";
import { formatZodError } from "@/back-end/lib/utils/helper";
import { confirmTicketSchema } from "@/back-end/lib/validation/ticket-validations";
import type { PaymentTransaction } from "@/back-end/types/payment-types";
import { randomUUID } from "crypto";
import { verifyTicketToken } from "@/back-end/lib/utils/jwt";

export class TicketService {
  async fulfill(transaction: PaymentTransaction) {
    try {
      if (!transaction.ticketTypeId || !transaction.quantity) {
        return {
          success: false,
          message: "Missing ticket type or quantity",
          status: 400,
        };
      }

      const quantity = transaction.quantity;

      // 1. Load existing tickets
      let tickets = await ticketModel.findByPaymentTransactionId(transaction.id);

      // 2. Create only if none exist
      if (tickets.length === 0) {
        tickets = await prisma.$transaction(async (tx) => {
          const ticketType = await tx.ticketType.findUnique({
            where: { id: transaction.ticketTypeId! },
          });

          if (!ticketType) {
            throw new Error("Ticket type not found");
          }

          if (ticketType.eventId !== transaction.eventId) {
            throw new Error("Ticket type does not belong to this event");
          }

          if (ticketType.capacity !== null && ticketType.capacity !== undefined) {
            const sold = await tx.ticket.count({
              where: {
                ticketTypeId: transaction.ticketTypeId!,
                paymentTransaction: { status: "SUCCESS" },
              },
            });

            if (sold + quantity > ticketType.capacity) {
              throw new Error(
                `Not enough tickets remaining. Only ${Math.max(
                  0,
                  ticketType.capacity - sold,
                )} left.`,
              );
            }
          }

          const ticketsData = Array.from({ length: quantity }).map((_, i) => ({
            reference: `${transaction.reference}-${i + 1}`,
            status: "PENDING" as const,
            paymentTransactionId: transaction.id,
            ticketTypeId: transaction.ticketTypeId!,
            eventId: transaction.eventId,
            ticket: `TIK-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`,
          }));

          return tx.ticket.createManyAndReturn({
            data: ticketsData,
          });
        });
      }

      // 3. If already SENT → do not resend email
      const alreadySent = tickets.every((t) => t.status === "SENT");
      if (alreadySent) {
        return {
          success: true,
          message: "Tickets already issued and sent",
          data: tickets,
          status: 200,
        };
      }

      // 4. Generate QR codes
      const qrCodes: string[] = [];
      const codes: string[] = [];

      for (const ticket of tickets) {
        const token = ticket.ticket;

        const qrBase64 = await QRCode.toDataURL(token, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: "H",
        });

        const qrUrl = await uploadQRCode(qrBase64);
        qrCodes.push(qrUrl);
        codes.push(token);
      }

      // 5. Send email
      const emailResult = await sendEmail(transaction.email, {
        type: "ticket",
        props: {
          firstName: (transaction.name || "Guest").split(" ")[0],
          ticketReference: transaction.reference,
          quantity: tickets.length,
          amount: Number(transaction.amount),
          eventName: "The Elite Glam",
          qrCodes,
          tickets: codes,
        },
      });

      if (!emailResult.success) {
        return {
          success: false,
          message: "Tickets created but email failed. Please contact support.",
          status: 500,
        };
      }

      // 6. Mark as SENT
      await ticketModel.updateStatusByPaymentTransactionId(transaction.id, "SENT");

      return {
        success: true,
        message: `Ticket${tickets.length > 1 ? "s" : ""} issued and sent successfully`,
        data: tickets,
        status: 200,
      };
    } catch (error: any) {
      console.error("[TicketService.fulfill]", error);

      if (error.code === "P2002") {
        const existing = await ticketModel.findByPaymentTransactionId(transaction.id);
        return {
          success: true,
          message: "Tickets already issued",
          data: existing,
          status: 200,
        };
      }

      if (error.message?.includes("Not enough tickets remaining")) {
        return {
          success: false,
          message: error.message,
          status: 409,
        };
      }

      if (error.message?.includes("does not belong to this event")) {
        return {
          success: false,
          message: error.message,
          status: 400,
        };
      }

      return {
        success: false,
        message: error?.message || "Failed to issue tickets",
        status: 500,
      };
    }
  }

  async resendTicketEmail(reference: string) {
    try {
      const payment = await prisma.paymentTransaction.findUnique({
        where: { reference },
        include: { tickets: true },
      });

      if (!payment) {
        return {
          success: false,
          message: "Payment record not found",
          status: 404,
        };
      }

      if (payment.purpose !== "TICKET") {
        return {
          success: false,
          message: "This reference is not for a ticket payment",
          status: 400,
        };
      }

      if (payment.status !== "SUCCESS") {
        return {
          success: false,
          message: "Payment has not been completed yet",
          status: 400,
        };
      }

      if (!payment.tickets.length) {
        return {
          success: false,
          message: "No tickets found for this payment",
          status: 404,
        };
      }

      // Rate limit: 1 resend every 2 minutes
      const rateLimitKey = `resend-ticket:${payment.reference}`;
      const recent = await prisma.idempotencyKey.findUnique({
        where: { key: rateLimitKey },
      });

      if (recent && recent.createdAt > new Date(Date.now() - 10 * 60 * 1000)) {
        return {
          success: false,
          message: "Please wait a few minutes before requesting another email",
          status: 429,
        };
      }

      // Generate QR codes again
      const qrCodes: string[] = [];
      const codes: string[] = [];

      for (const ticket of payment.tickets) {
        const token = ticket.ticket;

        const qrBase64 = await QRCode.toDataURL(token, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: "H",
        });

        const qrUrl = await uploadQRCode(qrBase64);
        qrCodes.push(qrUrl);
        codes.push(token);
      }

      const emailResult = await sendEmail(payment.email, {
        type: "ticket",
        props: {
          firstName: (payment.name || "Guest").split(" ")[0],
          ticketReference: payment.reference,
          quantity: payment.tickets.length,
          amount: Number(payment.amount),
          eventName: "The Elite Glam",
          qrCodes,
          tickets: codes,
        },
      });

      if (!emailResult.success) {
        return {
          success: false,
          message: "Failed to resend ticket email",
          status: 500,
        };
      }

      // Mark tickets SENT (in case they were still PENDING)
      await ticketModel.updateStatusByPaymentTransactionId(payment.id, "SENT");

      // Upsert rate-limit record
      await prisma.idempotencyKey.upsert({
        where: { key: rateLimitKey },
        create: {
          key: rateLimitKey,
          method: "POST",
          path: "/api/tickets/resend-email",
          statusCode: 200,
          response: { sent: true, at: new Date().toISOString() },
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        update: {
          statusCode: 200,
          response: { sent: true, at: new Date().toISOString() },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return {
        success: true,
        message: "Ticket email has been resent",
        status: 200,
      };
    } catch (error: any) {
      console.error("[TicketService.resendTicketEmail]", error);
      return {
        success: false,
        message: error?.message || "Failed to resend ticket email",
        status: 500,
      };
    }
  }

  async confirmTicket(token: string) {
    try {
      const validation = confirmTicketSchema.safeParse({ token });
      if (!validation.success) {
        return {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        };
      }

      const payload = await verifyTicketToken(validation.data.token);

      if (!payload) {
        return {
          success: false,
          message: "Invalid ticket",
          status: 400,
        };
      }

      const ticket = await ticketModel.findById(payload.ticketId);

      if (!ticket) {
        return {
          success: false,
          message: "Ticket not found",
          status: 404,
        };
      }

      if (ticket.status === "USED") {
        return {
          success: false,
          message: "Ticket already used",
          status: 400,
        };
      }

      await ticketModel.markAsUsed(ticket.id);

      return {
        success: true,
        message: "Ticket valid",
        data: ticket,
        status: 200,
      };
    } catch (error: any) {
      console.error("[TicketService.confirmTicket]", error);
      return {
        success: false,
        message: error?.message || "Failed to confirm ticket",
        status: 500,
      };
    }
  }
}

export const ticketService = new TicketService();
