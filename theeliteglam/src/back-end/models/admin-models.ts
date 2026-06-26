// src/back-end/models/admin-models.ts
import { prisma } from "../../back-end/db/db-connect";
import type { Admin, CreateAdminData, AdminUpdateData } from "../types/admin-types";

export class AdminRepo {
  async findByEmail(email: string): Promise<Admin | null> {
    return prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<Admin | null> {
    return prisma.admin.findUnique({
      where: { id },
    });
  }

  async create(data: CreateAdminData): Promise<Admin> {
    return prisma.admin.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        emailVerified: data.emailVerified ?? false,
        emailVerifiedAt: data.emailVerifiedAt ?? null,
        lastLoginAt: data.lastLoginAt ?? null,
        role: data.role ?? "ADMIN",
      },
    });
  }

  async update(id: string, data: AdminUpdateData): Promise<Admin | null> {
    return prisma.admin.update({
      where: { id },
      data,
    });
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
