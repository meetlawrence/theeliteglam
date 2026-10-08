import { prisma } from "../db/db-connect";
import type { TicketType, UpdateTicketType } from "../types/ticket-types";

export class TicketTypeModel {
  async create(data: TicketType) {
    return await prisma.ticketType.create({
      data: {
        name: data.name,
        price: data.price,
        capacity: data.capacity || null,
        benefits: data.benefits,
        eventId: data.eventId,
      },
    });
  }

  async findByEventId(eventId: string) {
    return await prisma.ticketType.findMany({
      where: { eventId },
      orderBy: { price: "asc" },
    });
  }

  async findById(id: string) {
    return await prisma.ticketType.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateTicketType) {
    return await prisma.ticketType.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        capacity: data.capacity,
        benefits: data.benefits,
      },
    });
  }

  async delete(id: string) {
    return await prisma.ticketType.delete({ where: { id } });
  }
}

export const ticketTypeRepo = new TicketTypeModel();
