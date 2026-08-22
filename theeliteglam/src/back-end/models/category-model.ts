import { prisma } from "@/back-end/database/db-connect";
import type { CreateCategoryInput, UpdateCategoryInput } from "../types/category-types";

export class CategoryModel {
  async create(data: CreateCategoryInput) {
    return await prisma.category.create({
      data: {
        name: data.name,
        eventId: data.eventId,
      },
    });
  }

  async findById(id: string) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });
  }

  async findByEventId(eventId: string) {
    return await prisma.category.findMany({
      where: { eventId },
      orderBy: { createdAt: "asc" },
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    return await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }

  async delete(id: string) {
    return await prisma.category.delete({ where: { id } });
  }
}

export const categoryModel = new CategoryModel();