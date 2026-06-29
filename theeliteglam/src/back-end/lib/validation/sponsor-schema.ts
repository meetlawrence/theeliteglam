import { z } from "zod";

export const createSponsorSchema = z.object({
  name: z.string().min(2, "Sponsor name is required"),
  logo: z.string().url("Invalid logo URL").optional(),
  website: z.string().url("Invalid website URL").optional(),
  description: z.string().optional(),
  tier: z.enum(["GOLD", "SILVER", "BRONZE"]),
  eventId: z.string().min(1, "Event ID is required"),
});

export const updateSponsorSchema = z.object({
  name: z.string().min(2).optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  tier: z.enum(["GOLD", "SILVER", "BRONZE"]).optional(),
});

export const sponsorIdParamSchema = z.object({
  id: z.string().cuid().min(1, "Sponsor ID is required"),
});

export const eventIdSchema = z.object({
  eventId: z.string().cuid().min(1, "Sponsor ID is required"),
});
