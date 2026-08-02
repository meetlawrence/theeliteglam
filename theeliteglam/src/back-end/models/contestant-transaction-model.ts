import { prisma } from "../db/db-connect";
import type { UpdateContestantTransaction, ContestantTransaction } from "../types/contestant-transaction-types";

export class ContestantTransactionModel {
  async create(data: ContestantTransaction) {
    return await prisma.contestantTransaction.create({
      data: {
        email: data.email,
        name: data.name,
        amount: data.amount,
        phoneNumber: data.phoneNumber,
        reference: data.reference,
        eventId: data.eventId
      },
    });
  }

  async findByEventId(id: string) {
    return await prisma.contestantTransaction.findMany({
      where: { eventId: id },
      orderBy: { amount: "desc" },
    });
  }

  async findByreference(reference: string) {
    return await prisma.contestantTransaction.findUnique({
      where: { reference },
    });
  }

  async update(reference: string, data: UpdateContestantTransaction) {
    return await prisma.contestantTransaction.update({
      where: { reference },
      data,
    });
  }
}

export const contestantTransactionRepo = new ContestantTransactionModel();
