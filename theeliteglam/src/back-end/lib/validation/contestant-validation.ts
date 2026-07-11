import { z } from "zod";

export const createContestantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["MALE", "FEMALE"]),
  stageName: z.string().min(2).optional(),
  avatar: z.string().min(2).optional(),
  height: z.number().positive(),
  weight: z.number().positive(),
  bio: z.string().optional(),
  portfolio: z.string().url().optional(),
  phone: z.string(),
  dateOfBirth: z.string().datetime(),
  city: z.string(),
  country: z.string(),
  contestantCategories: z.enum(["MALE", "FEMALE"]),
  eventId: z.string().cuid().min(1, "Event ID is required"),
});

export const updateContestantSchema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  stageName: z.string().min(2).optional(),
  avatar: z.string().min(2).optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  bio: z.string().optional(),
  portfolio: z.string().url().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  contestantCategories: z.enum(["MALE", "FEMALE"]).optional(),
  eventId: z.string().cuid().min(1, "Event ID is required").optional(),
});

export const contestantIdParamSchema = z.object({
  id: z.string().cuid().min(1, "Contestant ID is required"),
});

export const eventIdSchema = z.object({
  eventId: z.string().cuid().min(1, "Event ID is required"),
});
