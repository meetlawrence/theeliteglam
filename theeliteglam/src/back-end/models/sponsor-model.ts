import { prisma } from "../db/db-connect";
import type { CreateSponsorInput, UpdateSponsorInput } from "../types/sponsor-types";

export class SponsorModel {
  async create(data: CreateSponsorInput) {
    return await prisma.sponsor.create({
      data: {
        name: data.name,
        logo: data.logo,
        website: data.website,
        description: data.description,
        tier: data.tier,
        eventId: data.eventId,
      },
    });
  }

  async findById(id: string) {
    return await prisma.sponsor.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });
  }

  async findByEventId(eventId: string) {
    return await prisma.sponsor.findMany({
      where: { eventId },
      orderBy: { tier: "asc" },
    });
  }

  async update(id: string, data: UpdateSponsorInput) {
    return await prisma.sponsor.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.sponsor.delete({ where: { id } });
  }
}

export const sponsorModel = new SponsorModel();
