import { prisma } from "../db/db-connect";
import type { UpdateTicketTransaction, TicketTransaction } from "../types/tickets-transaction";

export class TicketTransactionModel {
  async create(data: TicketTransaction) {
    return await prisma.ticketTransaction.create({
      data: {
        email: data.email,
        name: data.name,
        amount: data.amount,
        quantity: data.quantity,
        total: data.total,
        phoneNumber: data.phoneNumber,
        ticketTypeId: data.ticketTypeId,
        reference: data.reference,
        eventId: data.eventId,
      },
    });
  }

  async findByEventId(eventId: string) {
    return await prisma.ticketTransaction.findMany({
      where: { eventId: eventId },
      orderBy: { amount: "asc" },
    });
  }

  async findByreference(reference: string) {
    return await prisma.ticketTransaction.findUnique({
      where: { reference },
    });
  }

  async update(reference: string, data: UpdateTicketTransaction) {
    return await prisma.ticketTransaction.update({
      where: { reference },
      data,
    });
  }
}

export const ticketTransactionRepo = new TicketTransactionModel();
