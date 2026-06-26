import bcrypt from "bcryptjs";
import { adminRepo } from "../models/admin-models";
import type { CreateAdminInput, UpdateAdminInput } from "../types/admin-types";
import { AUTH_CONFIG } from "../config/auth";
import {
  createAdminSchema2,
  adminIdParamSchema,
  updateAdminSchema,
} from "../lib/validation/admin-schema";

export class AdminService {
  async createAdmin(data: CreateAdminInput, currentUserRole: string) {
    try {
      const validation = createAdminSchema2.safeParse(data);
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can create new admins.");
      }

      const existing = await adminRepo.findByEmail(data.email);
      if (existing) throw new Error("Admin with this email already exists.");

      const passwordHash = await bcrypt.hash(data.password, AUTH_CONFIG.BCRYPT_SALT_ROUNDS);

      const admin = await adminRepo.createAdmin({
        name: data.name,
        email: data.email.toLowerCase(),
        password: passwordHash,
        role: data.role,
      });

      return {
        success: true,
        message: "Admin created successfully",
        data: admin,
      };
    } catch (error) {
      console.error("Create admin error:", error);
      return { success: false, error: "Failed to create admin" };
    }
  }

  async getAllAdmins(currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Access denied.");
      }

      const admins = await adminRepo.getAll();
      return { success: true, data: admins };
    } catch (error) {
      console.error("Get all admins error:", error);
      return { success: false, error: "Failed to fetch admins" };
    }
  }

  async getAdminById(id: string) {
    try {
      const validation = adminIdParamSchema.safeParse({ id });
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      const admin = await adminRepo.findById(id);
      if (!admin) throw new Error("Admin not found");

      return { success: true, data: admin };
    } catch (error) {
      console.error("Get admin error:", error);
      return { success: false, error: "Failed to fetch admin" };
    }
  }

  async updateAdmin(id: string, data: UpdateAdminInput, currentUserRole: string) {
    try {
      const validation = adminIdParamSchema.safeParse({ id });
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      const validation2 = updateAdminSchema.safeParse(data);
      if (!validation2.success) {
        const messages = validation2.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Access denied.");
      }

      const admin = await adminRepo.update(id, data);
      return { success: true, message: "Admin updated successfully", data: admin };
    } catch (error) {
      console.error("Update admin error:", error);
      return { success: false, error: "Failed to update admin" };
    }
  }

  async deleteAdmin(id: string, currentUserRole: string) {
    try {
      const validation = adminIdParamSchema.safeParse({ id });
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can delete admins.");
      }

      await adminRepo.delete(id);
      return { success: true, message: "Admin deleted successfully" };
    } catch (error) {
      console.error("Delete admin error:", error);
      return { success: false, error: "Failed to delete admin" };
    }
  }
}

export const adminService = new AdminService();
