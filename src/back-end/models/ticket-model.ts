import { prisma } from "@/back-end/db/db-connect";

type CreateTicketInput = {
  reference: string;
  status?: "PENDING" | "SENT" | "USED";
  paymentTransactionId: string;
  ticketTypeId: string;
  eventId: string;
  ticket: string;
};

export class TicketModel {
  async findByPaymentTransactionId(paymentTransactionId: string) {
    return prisma.ticket.findMany({
      where: { paymentTransactionId },
    });
  }

  async findById(id: string) {
    return prisma.ticket.findUnique({
      where: { id },
    });
  }

  async countSoldByTicketType(ticketTypeId: string) {
    return prisma.ticket.count({
      where: {
        ticketTypeId,
        paymentTransaction: {
          status: "SUCCESS",
        },
      },
    });
  }

  async createMany(tickets: CreateTicketInput[]) {
    return prisma.ticket.createManyAndReturn({
      data: tickets,
    });
  }

  async updateStatusByPaymentTransactionId(
    paymentTransactionId: string,
    status: "PENDING" | "SENT" | "USED"
  ) {
    return prisma.ticket.updateMany({
      where: { paymentTransactionId },
      data: { status },
    });
  }

  async markAsUsed(id: string) {
    return prisma.ticket.update({
      where: { id },
      data: { status: "USED" },
    });
  }
}

export const ticketModel = new TicketModel();