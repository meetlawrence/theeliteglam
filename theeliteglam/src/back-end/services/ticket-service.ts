import { generateTicketToken, verifyTicketToken } from "../lib/utils/jwt";
import { prisma } from "../db/db-connect";
import { referenceSchema } from "../lib/validation/ticket-schema";
import { formatZodError } from "../lib/utils/helper";
import QRCode from "qrcode";
import { sendEmail } from "../lib/email/resend";
import { uploadQRCode } from "../db/cloudinary";

export class TicketService {
  async createTicket(reference: string) {
  try {
    // 1. Validate reference
    const validation = referenceSchema.safeParse({ id: reference });
    if (!validation.success) {
      return {
        success: false,
        error: formatZodError(validation.error),
        status: 400,
      };
    }

    // 2. Find the Ticket Transaction
    const ticketTransaction = await prisma.ticketTransaction.findUnique({
      where: { reference },
      include: {
        tickets: true, // important
      },
    });

    if (!ticketTransaction) {
      return {
        success: false,
        error: "Record not found",
        status: 404,
      };
    }

    // 3. If already claimed → stop
    if (ticketTransaction.claimed) {
      return {
        success: false,
        error: "Tickets already sent to your email",
        status: 400,
      };
    }

    let tickets = ticketTransaction.tickets;
    let isNewTickets = false;

    // ====================== CREATE TICKETS IF THEY DON'T EXIST ======================
    if (tickets.length === 0) {
      isNewTickets = true;

      const qty = ticketTransaction.quantity || 1;

      tickets = await prisma.$transaction(async (tx) => {
        const createdTickets = [];

        for (let i = 1; i <= qty; i++) {
          const ticket = await tx.ticket.create({
            data: {
              reference: ticketTransaction.reference,
              status: "SEND",
              ticketTransactionId: ticketTransaction.id,
            },
          });
          createdTickets.push(ticket);
        }

        return createdTickets;
      });
    }

    // ====================== GENERATE QR CODES ======================
    const qrCodes: string[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];

      const token = await generateTicketToken({
        ticketId: ticket.id,
        reference: ticket.reference,
        email: ticketTransaction.email,
        status: ticket.status,
        name: ticketTransaction.name,
        index: i + 1,
      });

      const qrBase64 = await QRCode.toDataURL(token, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      const qrUrl = await uploadQRCode(qrBase64);
      qrCodes.push(qrUrl);
    }

    // ====================== SEND EMAIL ======================
    const emailResult = await sendEmail(ticketTransaction.email, {
      type: "ticket",
      props: {
        firstName: ticketTransaction.name.split(" ")[0] || ticketTransaction.name,
        ticketReference: ticketTransaction.reference,
        quantity: tickets.length,
        amount: ticketTransaction.amount,
        eventName: "Handcrafted Haven Workshop",
        qrCodes,
      },
    });

    // ====================== MARK AS CLAIMED ONLY IF EMAIL SUCCEEDED ======================
    if (emailResult.success) {
      await prisma.ticketTransaction.update({
        where: { reference },
        data: {
          clamed: true,
          status: "SUCCESS",
        },
      });

      return {
        success: true,
        message: isNewTickets
          ? `Ticket${tickets.length > 1 ? "s" : ""} created and sent successfully`
          : `Ticket${tickets.length > 1 ? "s" : ""} resent successfully`,
        emailSent: true,
      };
    }

    // Email failed
    return {
      success: false,
      error: "Tickets generated but email failed. Please try again.",
      status: 500,
    };
  } catch (error: any) {
    console.error("[TicketService.createTicket]", error);

    return {
      success: false,
      error: "Failed to create ticket",
      status: 500,
    };
  }
  }
  
  async confirmTicket(token: string) {
    const payload = await verifyTicketToken(token);

    if (!payload) {
      // Invalid / forged ticket
      return { valid: false, message: "Invalid ticket" };
    }

    // Check in database
    const ticket = await prisma.ticket.findUnique({
      where: { id: payload.ticketId },
    });

    if (!ticket || ticket.status === "USED") {
      return { valid: false, message: "Ticket already used" };
    }

    // Mark as used
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: "USED" },
    });

    return { valid: true, message: "Ticket valid" };
  }
}
export const ticketService = new TicketService();
