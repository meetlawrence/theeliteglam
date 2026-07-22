import { prisma } from "../db/db-connect";
import type { CreateContestantInput, UpdateContestantInput } from "../types/contestant-types";

export class ContestantModel {
  async findByEmail(email: string) {
    return prisma.contestant.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async create(data: CreateContestantInput) {
    return await prisma.contestant.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        gender: data.gender,
        stageName: data.stageName,
        height: data.height,
        weight: data.weight,
        bio: data.bio,
        portfolio: data.portfolio,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        city: data.city,
        country: data.country,
        contestantCategories: data.contestantCategories,
        eventId: data.eventId,
      },
    });
  }

  async findById(id: string) {
    return await prisma.contestant.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await prisma.contestant.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findByEventId(eventId: string) {
    return await prisma.contestant.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: UpdateContestantInput) {
    return await prisma.contestant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.contestant.delete({ where: { id } });
  }
}

export const contestantModel = new ContestantModel();
