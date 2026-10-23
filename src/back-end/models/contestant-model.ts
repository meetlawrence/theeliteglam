import { prisma } from "@/back-end/db/db-connect";
import type { CreateContestantInput, UpdateContestantInput } from "@/back-end/types/contestant-types";

export class ContestantModel {
  async findByEmail(email: string) {
    return prisma.contestant.findFirst({
      where: { email: email.toLowerCase() },
    });
  }

  async findByReference(reference: string) {
    return prisma.contestant.findUnique({
      where: { reference },
    });
  }

  async findByPaymentTransactionId(paymentTransactionId: string) {
    return prisma.contestant.findUnique({
      where: { paymentTransactionId },
    });
  }

  async findById(id: string) {
    return prisma.contestant.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return prisma.contestant.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findByEventId(eventId: string) {
    return prisma.contestant.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: CreateContestantInput) {
    return prisma.contestant.create({
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
        reference: data.reference,
        paymentTransactionId: data.paymentTransactionId,
      },
    });
  }

  async update(id: string, data: UpdateContestantInput) {
    return prisma.contestant.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.contestant.delete({
      where: { id },
    });
  }
}

export const contestantModel = new ContestantModel();