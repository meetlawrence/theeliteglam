import { prisma } from "../db/db-connect";
import type { Ticket, UpdateTicket } from "../types/tickets";

export class TicketModel {
  async create(data: Ticket) {
    return await prisma.ticket.create({
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
    return await prisma.ticket.findMany({
      where: { eventId: eventId },
      orderBy: { amount: "asc" },
    });
  }

  async findByreference(reference: string) {
    return await prisma.ticket.findUnique({
      where: { reference },
    });
  }

  async update(reference: string, data: UpdateTicket) {
    return await prisma.ticket.update({
      where: { reference },
      data,
    });
  }
}

export const ticketRepo = new TicketModel();
