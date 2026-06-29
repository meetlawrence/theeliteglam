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
});

export const updateContestantSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  stageName: z.string().optional(),
  bio: z.string().optional(),
  portfolio: z.string().url().optional(),
  isVerified: z.boolean().optional(),
  score: z.number().positive().optional(),
  rank: z.number().positive().optional(),
  contestantCategories: z.enum(["MALE", "FEMALE"]),
});

export const contestantIdParamSchema = z.object({
  id: z.string().cuid().min(1, "Contestant ID is required"),
});
