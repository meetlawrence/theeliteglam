import bcrypt from "bcryptjs";
import { adminRepo } from "../models/admin-models";
import type { CreateAdminInput, UpdateAdminInput } from "../types/admin-types";
import { AUTH_CONFIG } from "../config/auth";
import {
  createAdminSchema2,
  adminIdParamSchema,
  updateAdminSchema,
} from "../lib/validation/admin-schema";
import { formatZodError } from "../lib/utils/helper";

export class AdminService {
  async createAdmin(data: CreateAdminInput, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return { success: false, error: "Access denied.", status: 403 };
      }

      const validation = createAdminSchema2.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      const existing = await adminRepo.findByEmail(validation.data.email);
      if (existing)
        return { success: false, error: "Admin with this email already exists.", status: 400 };

      const passwordHash = await bcrypt.hash(data.password, AUTH_CONFIG.BCRYPT_SALT_ROUNDS);

      const admin = await adminRepo.createAdmin({
        name: validation.data.name,
        email: validation.data.email.toLowerCase(),
        password: passwordHash,
        role: validation.data.role,
      });

      return {
        success: true,
        message: "Admin created successfully",
        data: admin,
      };
    } catch (error) {
      console.error("Create admin error:", error);
      return { success: false, error: error || "Failed to create admin", status: 500 };
    }
  }

  async getAllAdmins(currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return { success: false, error: "Access denied.", status: 403 };
      }

      const admins = await adminRepo.getAll();
      return { success: true, data: admins, status: 200 };
    } catch (error) {
      console.error("Get all admins error:", error);
      return { success: false, error: error || "Failed to fetch admins", status: 500 };
    }
  }

  async getAdminById(id: string) {
    try {
      const validation = adminIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      console.log(validation);
      const admin = await adminRepo.findById(validation.data.id);
      if (!admin) {
        return { success: false, error: "Admin not found", status: 404 };
      }

      return { success: true, data: admin, status: 200 };
    } catch (error) {
      console.error("Get admin error:", error);
      return { success: false, error: error || "Failed to fetch admin", status: 500 };
    }
  }

  async updateAdmin(id: string, data: UpdateAdminInput, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return { success: false, error: "Access denied.", status: 403 };
      }

      const validation = adminIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      const validation2 = updateAdminSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error), status: 400 };
      }

      const admin = await adminRepo.update(validation.data.id, validation2.data);
      return { success: true, message: "Admin updated successfully", data: admin, status: 200 };
    } catch (error) {
      console.error("Update admin error:", error);
      return { success: false, error: error || "Failed to update admin", status: 500 };
    }
  }

  async deleteAdmin(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return { success: false, error: "Only SUPER_ADMIN can delete admins.", status: 403 };
      }
      const validation = adminIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      await adminRepo.delete(validation.data.id);
      return { success: true, message: "Admin deleted successfully", status: 200 };
    } catch (error) {
      console.error("Delete admin error:", error);
      return { success: false, error: error || "Failed to delete admin", status: 500 };
    }
  }
}

export const adminService = new AdminService();
