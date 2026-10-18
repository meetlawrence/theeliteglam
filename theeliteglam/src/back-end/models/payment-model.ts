import { prisma } from "@/back-end/database/db-connect";
import type { PaymentPurpose, PaymentGateway } from "@/back-end/types/payment-types";

type CreatePaymentInput = {
  reference: string;
  purpose: PaymentPurpose;
  gateway: PaymentGateway;
  amount: number;
  email: string;
  phoneNumber?: string | null;
  name?: string | null;
  eventId: string;
  ticketTypeId?: string | null;
  quantity?: number | null;
  gatewayReference?: string | null;
  metadata?: Record<string, any> | null;
};

export const paymentModel = {
  async create(data: CreatePaymentInput) {
    return prisma.paymentTransaction.create({
      data: {
        reference: data.reference,
        purpose: data.purpose as any,
        gateway: data.gateway,
        amount: data.amount,
        email: data.email,
        phoneNumber: data.phoneNumber,
        name: data.name,
        eventId: data.eventId,
        ticketTypeId: data.ticketTypeId,
        quantity: data.quantity,
        gatewayReference: data.gatewayReference,
        metadata: data.metadata ?? undefined,
        status: "PENDING",
        fulfillmentStatus: "PENDING",
      },
    });
  },

  async findByReference(reference: string) {
    return prisma.paymentTransaction.findUnique({
      where: { reference },
      include: {
        tickets: true,
        contestant: true,
        event: true,
      },
    });
  },

  async updateGatewayReference(reference: string, gatewayReference: string) {
    return prisma.paymentTransaction.update({
      where: { reference },
      data: { gatewayReference },
    });
  },

  async markSuccess(reference: string, gatewayReference?: string | null) {
    return prisma.paymentTransaction.update({
      where: { reference },
      data: {
        status: "SUCCESS",
        gatewayReference: gatewayReference ?? undefined,
      },
    });
  },

  /**
   * REAL atomic claim.
   * Only one concurrent request can move:
   * PENDING → PROCESSING
   */
  async claimForFulfillment(reference: string) {
    const result = await prisma.paymentTransaction.updateMany({
      where: {
        reference,
        status: "SUCCESS",
        fulfillmentStatus: "PENDING",
      },
      data: {
        fulfillmentStatus: "PROCESSING",
      },
    });

    return result.count === 1;
  },

  async markFulfilled(reference: string) {
    return prisma.paymentTransaction.update({
      where: { reference },
      data: { fulfillmentStatus: "COMPLETED" },
    });
  },

  async markFulfillmentFailed(reference: string) {
    return prisma.paymentTransaction.update({
      where: { reference },
      data: { fulfillmentStatus: "FAILED" },
    });
  },

  async markFailed(reference: string) {
    return prisma.paymentTransaction.update({
      where: { reference },
      data: { status: "FAILED" },
    });
  },
  async findFailedFulfillments() {
    return prisma.paymentTransaction.findMany({
      where: {
        status: "SUCCESS",
        fulfillmentStatus: "FAILED",
      },
      include: {
        event: true,
        tickets: true,
        contestant: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  /**
   * Allow admin retry: move FAILED → PENDING so claim can run again
   */
  async resetFulfillmentForRetry(reference: string) {
    const result = await prisma.paymentTransaction.updateMany({
      where: {
        reference,
        status: "SUCCESS",
        fulfillmentStatus: "FAILED",
      },
      data: {
        fulfillmentStatus: "PENDING",
      },
    });

    return result.count === 1;
  },
};
