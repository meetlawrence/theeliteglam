import { prisma } from "../db/db-connect";
import type { UpdateTicket, Ticket } from "../types/ticket";

export class TicketModel {
  async create(data: Ticket) {
    return await prisma.ticket.create({
      data: {
        reference: data.reference,
        status: data.status as any,
        ticketTransactionId: data.ticketTransactionId,
      },
    });
  }

  async findByTicketId(id: string) {
    return await prisma.ticket.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTicket) {
    return await prisma.ticket.update({
      where: { id },
      data: data as any,
    });
  }

  // may use later
  async createdata (data: Ticket) {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.ticket.create({
          data: {
            reference: data.reference,
            status: data.status as any,
            ticketTransactionId: data.ticketTransactionId,
          },
        });
      })
    } catch (error) {
      
    }
  }
}

export const ticketRepo = new TicketModel();
