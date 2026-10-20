import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
  eventId: z.string().min(1, "Event ID is required"),
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
});

export const categoryIdParamSchema = z.object({
  id: z.string().cuid().min(1, "Category ID is required"),
});

export const eventIdSchema = z.object({
  eventId: z.string().cuid().min(1, "Sponsor ID is required"),
});
