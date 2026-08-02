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
        image: data.image,
        stageName: data.stageName,
        height: data.height,
        weight: data.weight,
        bio: data.bio,
        portfolio: data.portfolio,
        phone: data.phone,
        age: data.age,
        state: data.state,
        country: data.country,
        occupation: data.occupation,
        advocacy: data.advocacy,
        funFact: data.funFact,
        tribe: data.tribe,
        contestantCategories: data.contestantCategories,
        eventId: data.eventId,
        reference: data.reference
      },
    });
  }

  findByreference(reference: string) {
    return prisma.contestant.findUnique({
      where: { reference: reference },
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
