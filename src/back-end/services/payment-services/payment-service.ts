import { paymentModel } from "@/back-end/models/payment-model";
import { paystackGateway } from "./paystack-gateway";
import { opayGateway } from "./opay-gateway";
import type {
  InitializePaymentInput,
  PaymentResult,
  PaymentGateway as GatewayType,
} from "@/back-end/types/payment-types";
import { randomUUID } from "crypto";
import { prisma } from "@/back-end/database/db-connect";
import { generateTicketToken } from "@/back-end/lib/utils/jwt";
import QRCode from "qrcode";
import { uploadQRCode } from "@/back-end/db/cloudinary";
import { sendEmail } from "@/back-end/lib/email/resend";

type PaymentTransaction = NonNullable<
  Awaited<ReturnType<typeof paymentModel.findByReference>>
>;

async function sendContestantFormLink(
  transaction: PaymentTransaction,
): Promise<PaymentResult> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    return {
      success: false,
      message: "The contestant form URL is not configured",
      status: 500,
    };
  }

  const emailResult = await sendEmail(transaction.email, {
    type: "contestant-form",
    props: {
      firstName: transaction.name?.split(" ")[0] || transaction.name || "Contestant",
      formLink: `${baseUrl}/register/form?reference=${encodeURIComponent(transaction.reference)}`,
      reference: transaction.reference,
      eventName: transaction.event.name || "The Elite Glam Pageant",
    },
  });

  if (!emailResult.success) {
    return {
      success: false,
      message: "Contestant form link generated but email failed",
      status: 500,
    };
  }

  return {
    success: true,
    message: "Contestant form link has been sent",
    status: 200,
  };
}

async function sendPaymentTickets(
  transaction: PaymentTransaction,
  tickets: Array<{ id: string; reference: string; status: string; ticket: string }>,
  message: string,
): Promise<PaymentResult> {
  const qrCodes = await Promise.all(
    tickets.map(async ({ ticket }) => {
      const qrCode = await QRCode.toDataURL(ticket, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: "H",
      });
      return uploadQRCode(qrCode);
    }),
  );

  const emailResult = await sendEmail(transaction.email, {
    type: "ticket",
    props: {
      firstName: transaction.name?.split(" ")[0] || transaction.name || "Guest",
      ticketReference: transaction.reference,
      quantity: tickets.length,
      amount: Number(transaction.amount),
      eventName: transaction.event.name || "Event",
      qrCodes,
    },
  });

  if (!emailResult.success) {
    return {
      success: false,
      message: "Tickets were created but the email could not be sent",
      status: 500,
    };
  }

  return {
    success: true,
    message,
    status: 200,
    data: tickets.map(({ id, reference, status }) => ({ id, reference, status })),
  };
}

async function fulfillPaymentTickets(
  transaction: PaymentTransaction,
): Promise<PaymentResult> {
  const ticketTypeId = transaction.ticketTypeId;
  if (!ticketTypeId) {
    return {
      success: false,
      message: "Ticket type is missing from the payment",
      status: 400,
    };
  }

  if (transaction.tickets.length > 0) {
    return sendPaymentTickets(
      transaction,
      transaction.tickets,
      "Tickets sent successfully",
    );
  }

  const quantity = transaction.quantity ?? 1;
  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      success: false,
      message: "Ticket quantity is invalid",
      status: 400,
    };
  }

  const tickets = await Promise.all(
    Array.from({ length: quantity }, async (_, index) => {
      const id = randomUUID();
      const ticket = await generateTicketToken({
        ticketId: id,
        reference: transaction.reference,
        email: transaction.email,
        status: "SENT",
        name: transaction.name || transaction.email,
        index: index + 1,
      });

      return {
        id,
        reference: transaction.reference,
        status: "SENT" as const,
        paymentTransactionId: transaction.id,
        ticket,
        ticketTypeId,
        eventId: transaction.eventId,
      };
    }),
  );

  await prisma.ticket.createMany({ data: tickets });

  return sendPaymentTickets(
    transaction,
    tickets,
    "Tickets created and sent successfully",
  );
}

async function resendPaymentTicketEmail(reference: string): Promise<PaymentResult> {
  const transaction = await paymentModel.findByReference(reference);
  if (!transaction) {
    return { success: false, message: "Payment not found", status: 404 };
  }

  if (transaction.purpose !== "TICKET" || transaction.tickets.length === 0) {
    return {
      success: false,
      message: "No issued tickets are available to resend",
      status: 400,
    };
  }

  return sendPaymentTickets(
    transaction,
    transaction.tickets,
    "Tickets resent successfully",
  );
}

function getGateway(method: GatewayType) {
  if (method === "PAYSTACK") return paystackGateway;
  if (method === "OPAY") return opayGateway;
  throw new Error(`Unsupported payment method: ${method}`);
}

export class PaymentService {
  // ====================== INITIALIZE ======================
  async initialize(body: InitializePaymentInput): Promise<PaymentResult> {
    try {
      const event = await prisma.event.findUnique({
        where: { id: body.eventId },
      });

      if (!event) {
        return {
          success: false,
          message: "Event not found",
          status: 404,
        };
      }

      if (event.status === "CANCELLED" || event.status === "COMPLETED") {
        return {
          success: false,
          message: "This event is not accepting payments",
          status: 400,
        };
      }

      let amount = 0;

      if (body.purpose === "TICKET") {
        const ticketType = await prisma.ticketType.findUnique({
          where: { id: body.ticketTypeId },
        });

        if (!ticketType) {
          return {
            success: false,
            message: "Ticket type not found",
            status: 404,
          };
        }

        if (ticketType.eventId !== body.eventId) {
          return {
            success: false,
            message: "Ticket type does not belong to this event",
            status: 400,
          };
        }

        if (ticketType.capacity !== null && ticketType.capacity !== undefined) {
          const sold = await prisma.ticket.count({
            where: {
              ticketTypeId: body.ticketTypeId,
              paymentTransaction: { status: "SUCCESS" },
            },
          });

          if (sold + (body.quantity ?? 1) > ticketType.capacity) {
            return {
              success: false,
              message: "Not enough tickets remaining for this type",
              status: 400,
            };
          }
        }

        amount = Number(ticketType.price) * (body.quantity ?? 1);
      } else {
        // CONTESTANT
        amount = Number(event.contestantFee);
      }

      const reference =
        body.purpose === "TICKET"
          ? `TIK-${randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`
          : `CON-${randomUUID().replace(/-/g, "").slice(0, 16).toUpperCase()}`;

      const transaction = await paymentModel.create({
        reference,
        purpose: body.purpose,
        gateway: body.method,
        amount,
        email: body.email,
        phoneNumber: body.phoneNumber,
        name: body.name,
        eventId: body.eventId,
        ticketTypeId: body.purpose === "TICKET" ? body.ticketTypeId : null,
        quantity: body.purpose === "TICKET" ? body.quantity : null,
      });

      const gateway = getGateway(body.method);
      const init = await gateway.initialize({
        email: body.email,
        amount,
        reference,
        callbackUrl: process.env.PAYSTACK_CALLBACK_URL,
        metadata: {
          purpose: body.purpose,
          eventId: body.eventId,
        },
      });

      if (!init.success) {
        await paymentModel.markFailed(reference);
        return {
          success: false,
          message: init.message || "Payment gateway initialization failed",
          status: 502,
        };
      }

      if (init.gatewayReference) {
        await paymentModel.updateGatewayReference(reference, init.gatewayReference);
      }

      return {
        success: true,
        message: "Payment initialized successfully",
        status: 200,
        data: {
          provider: body.method,
          paymentId: transaction.id,
          reference: transaction.reference,
          authorizationUrl: init.authorizationUrl,
          accessCode: init.accessCode,
          purpose: body.purpose,
        },
      };
    } catch (error: any) {
      console.error("[PaymentService.initialize]", error);
      return {
        success: false,
        message: error?.message || "Failed to initialize payment",
        status: 500,
      };
    }
  }

  // ====================== VERIFY (Concurrency-safe) ======================
  async verify(reference: string): Promise<PaymentResult> {
    try {
      const transaction = await paymentModel.findByReference(reference);

      if (!transaction) {
        return {
          success: false,
          message: "Payment not found",
          status: 404,
        };
      }

      // Already completed
      if (transaction.status === "SUCCESS" && transaction.fulfillmentStatus === "COMPLETED") {
        return {
          success: true,
          message: "Payment already verified and fulfilled",
          status: 200,
          data: { transaction },
        };
      }

      // Verify with gateway
      const gateway = getGateway(transaction.gateway);
      const verified = await gateway.verify(reference);

      if (!verified.success || verified.status !== "SUCCESS") {
        if (verified.status === "FAILED") {
          await paymentModel.markFailed(reference);
        }
        return {
          success: false,
          message: verified.message || "Payment was not successful",
          status: 400,
        };
      }

      // Amount check
      const expected = Number(transaction.amount);
      const paid = Number(verified.amount);

      if (Math.abs(paid - expected) > 0.01) {
        await paymentModel.markFailed(reference);
        return {
          success: false,
          message: "Paid amount does not match expected amount",
          status: 400,
        };
      }

      // currency check
      if (verified.currency && verified.currency !== "NGN") {
        await paymentModel.markFailed(reference);
        return {
          success: false,
          message: "Unexpected payment currency",
          status: 400,
        };
      }

      // Mark payment SUCCESS (safe to call multiple times)
      await paymentModel.markSuccess(reference, verified.gatewayReference);

      // ATOMIC CLAIM — only one request continues
      const claimed = await paymentModel.claimForFulfillment(reference);

      if (!claimed) {
        const latest = await paymentModel.findByReference(reference);
        return {
          success: true,
          message: "Payment already being processed or completed",
          status: 200,
          data: { transaction: latest },
        };
      }

      // Fulfillment
      if (transaction.purpose === "TICKET") {
        const result = await fulfillPaymentTickets(transaction);

        if (!result.success) {
          await paymentModel.markFulfillmentFailed(reference);
          return {
            success: false,
            message: result.message || "Ticket fulfillment failed",
            status: 500,
          };
        }

        await paymentModel.markFulfilled(reference);

        return {
          success: true,
          message: "Payment verified and tickets issued successfully",
          status: 200,
          data: {
            transaction: await paymentModel.findByReference(reference),
            purpose: "TICKET",
            tickets: result.data,
          },
        };
      }

      if (transaction.purpose === "CONTESTANT") {
        const result = await sendContestantFormLink(transaction);

        if (!result.success) {
          await paymentModel.markFulfillmentFailed(reference);
          return {
            success: false,
            message: result.message || "Failed to send contestant form link",
            status: 500,
          };
        }

        await paymentModel.markFulfilled(reference);
        return {
          success: true,
          message: "Payment verified. Contestant form link has been sent.",
          status: 200,
          data: {
            transaction: await paymentModel.findByReference(reference),
            purpose: "CONTESTANT",
          },
        };
      }

      return {
        success: false,
        message: "Unknown payment purpose",
        status: 400,
      };
    } catch (error: any) {
      console.error("[PaymentService.verify]", error);
      return {
        success: false,
        message: error?.message || "Failed to verify payment",
        status: 500,
      };
    }
  }

  async listFailedFulfillments() {
    try {
      const rows = await paymentModel.findFailedFulfillments();
      return {
        success: true,
        message: "Failed fulfillments fetched",
        status: 200,
        data: rows,
      };
    } catch (error: any) {
      console.error("[PaymentService.listFailedFulfillments]", error);
      return {
        success: false,
        message: error?.message || "Failed to fetch failed fulfillments",
        status: 500,
      };
    }
  }

  async retryFulfillment(reference: string): Promise<PaymentResult> {
    try {
      const transaction = await paymentModel.findByReference(reference);

      if (!transaction) {
        return {
          success: false,
          message: "Payment not found",
          status: 404,
        };
      }

      if (transaction.status !== "SUCCESS") {
        return {
          success: false,
          message: "Only successful payments can be retried",
          status: 400,
        };
      }

      // ---------- TICKET ----------
      if (transaction.purpose === "TICKET") {
        const hasTickets = (transaction.tickets?.length ?? 0) > 0;

        // Tickets already exist → only resend email (no new tickets)
        if (hasTickets) {
          const result = await resendPaymentTicketEmail(reference);

          if (result.success && transaction.fulfillmentStatus !== "COMPLETED") {
            await paymentModel.markFulfilled(reference);
          }

          return result;
        }

        // No tickets yet → real fulfillment retry
        if (transaction.fulfillmentStatus === "FAILED") {
          const reset = await paymentModel.resetFulfillmentForRetry(reference);
          if (!reset) {
            return {
              success: false,
              message: "Unable to reset fulfillment for retry",
              status: 409,
            };
          }
        }

        const claimed = await paymentModel.claimForFulfillment(reference);
        if (!claimed) {
          return {
            success: false,
            message: "Fulfillment is already being processed",
            status: 409,
          };
        }

        const result = await fulfillPaymentTickets(transaction);

        if (!result.success) {
          await paymentModel.markFulfillmentFailed(reference);
          return {
            success: false,
            message: result.message || "Ticket fulfillment failed",
            status: result.status || 500,
          };
        }

        await paymentModel.markFulfilled(reference);

        return {
          success: true,
          message: "Ticket fulfillment retried successfully",
          status: 200,
          data: result.data,
        };
      }

      // ---------- CONTESTANT ----------
      if (transaction.purpose === "CONTESTANT") {
        // Always safe to resend form link (rate-limited inside service)
        const result = await sendContestantFormLink(transaction);

        if (result.success && transaction.fulfillmentStatus !== "COMPLETED") {
          await paymentModel.markFulfilled(reference);
        }
        return result;
      }

      return {
        success: false,
        message: "Unknown payment purpose",
        status: 400,
      };
    } catch (error: any) {
      console.error("[PaymentService.retryFulfillment]", error);
      return {
        success: false,
        message: error?.message || "Failed to retry fulfillment",
        status: 500,
      };
    }
  }
}

export const paymentService = new PaymentService();
