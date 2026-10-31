import { prisma } from "../db/db-connect";
import type {
  CreateEventInput,
  EventStatus,
  UpdateEventInput,
} from "../types/event-types";

const DEFAULT_EVENT_STATUS: EventStatus = {
  isRegistrationOpen: false,
  isTicketsOpen: false,
  isVotingOpen: false,
  isContestantsVisible: false,
};

export class EventModel {
  async create(data: CreateEventInput) {
    return await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        location: data.location,
        status: data.status || "UPCOMING",
        categories: data.categories,
        contestantFee: data.contestantFee,
      },
    });
  }

  async findAll() {
    return await prisma.event.findMany({
      orderBy: { startDate: "desc" },
    });
  }

  async findFirstId() {
    return await prisma.event.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
  }

  async findStatus(): Promise<EventStatus> {
    const event = await prisma.event.findFirst({
      select: {
        isRegistrationOpen: true,
        isTicketsOpen: true,
        isVotingOpen: true,
        isContestantsVisible: true,
      },
    });

    return event ?? DEFAULT_EVENT_STATUS;
  }

  async findById(id: string) {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        ticketTypes: true,
      },
    });
  }

  async update(id: string, data: UpdateEventInput) {
    return await prisma.event.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        location: data.location,
        status: data.status,
        categories: data.categories,
        contestantFee: data.contestantFee,
      },
    });
  }

  async delete(id: string) {
    return await prisma.event.delete({ where: { id } });
  }
}

export const eventModel = new EventModel();
