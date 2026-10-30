import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createAdminSchema2 = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "SUPER_ADMIN", "TICKETS_VALIDATOR"]).optional().default("ADMIN"),
});

export const updateAdminSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
  role: z.enum(["ADMIN", "SUPER_ADMIN", "TICKETS_VALIDATOR"]).optional().default("ADMIN"),
});

export const adminIdParamSchema = z.object({
  id: z.string().cuid().min(1, "Admin ID is required"),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
