// src/back-end/models/admin-models.ts
import { prisma } from "@/back-end/db/db-connect";
import type {
  Admin,
  CreateAdminData,
  AdminUpdateData,
  CreateAdminInput,
} from "../types/admin-types";

export class AdminRepo {
  async findByEmail(email: string): Promise<Admin | null> {
    return prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string) {
    return await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  async create(data: CreateAdminData): Promise<Admin> {
    return await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
      },
    });
  }

  async createAdmin(data: CreateAdminInput) {
    return await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.password,
        isActive: true,
        role: data.role,
      },
    });
  }

  async getAll() {
    return await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: AdminUpdateData) {
    return await prisma.admin.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  async delete(id: string) {
    return await prisma.admin.delete({ where: { id } });
  }

  async markEmailVerified(adminId: string): Promise<void> {
    await prisma.admin.update({
      where: { id: adminId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
  }
}

export const adminRepo = new AdminRepo();
