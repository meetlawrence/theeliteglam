import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  location: z.string().min(3, "Location is required"),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
  categories: z.array(z.enum(["MALE", "FEMALE"])).min(1, "At least one category is required"),
  contestantFee: z.number().positive("Total must be positive"),
});

export const updateEventSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  location: z.string().min(3).optional(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]).optional(),
  categories: z.array(z.enum(["MALE", "FEMALE"])).min(1, "At least one category is required").optional(),
});

export const eventIdParamSchema = z.object({
  id: z.string().cuid().min(1, "Event ID is required"),
});
