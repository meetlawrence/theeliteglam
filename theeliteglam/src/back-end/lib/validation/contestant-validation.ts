import { z } from "zod";

export const createContestantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["MALE", "FEMALE"]),
  image: z.string().url("Image must be a valid URL").optional(),
  stageName: z.string().min(2).optional(),
  height: z.number().positive("Height must be positive").optional(),
  weight: z.number().positive("Weight must be positive").optional(),
  bio: z.string().optional(),
  portfolio: z.string().url("Portfolio must be a valid URL").optional(),
  phone: z.string().min(7, "Phone number must be valid"),
  age: z.number().int().positive("Age must be positive"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  occupation: z.string().min(2, "Occupation is required"),
  advocacy: z.string().min(2, "Advocacy is required"),
  funFact: z.string().min(2, "Fun fact is required"),
  tribe: z.string().min(2, "Tribe is required"),
  contestantCategories: z.enum(["MALE", "FEMALE"]),
  eventId: z.string().cuid("Invalid event ID"),
});

export const updateContestantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(7, "Phone number must be valid").optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  stageName: z.string().min(2).optional(),
  bio: z.string().optional(),
  portfolio: z.string().url("Portfolio must be a valid URL").optional(),
  number: z.number().int().positive("Contestant number must be positive").optional(),
  age: z.number().int().positive("Age must be positive").optional(),
  state: z.string().min(2).optional(),
  country: z.string().min(2).optional(),
  occupation: z.string().min(2).optional(),
  advocacy: z.string().min(2).optional(),
  funFact: z.string().min(2).optional(),
  tribe: z.string().min(2).optional(),
  isVerified: z.boolean().optional(),
  score: z.number().int().nonnegative("Score must be non-negative").optional(),
  rank: z.number().int().positive("Rank must be positive").optional(),
  contestantCategories: z.enum(["MALE", "FEMALE"]).optional(),
  eventId: z.string().cuid("Invalid event ID").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const contestantIdParamSchema = z.object({
  id: z.string().cuid().min(1, "Contestant ID is required"),
});

export const eventIdSchema = z.object({
  eventId: z.string().cuid().min(1, "Event ID is required"),
});
