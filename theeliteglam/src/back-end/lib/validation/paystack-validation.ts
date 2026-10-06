import { z } from "zod";

export const paystackInitializeResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: z
    .object({
      authorization_url: z.string().url(),
      access_code: z.string().min(1),
      reference: z.string().min(1),
    })
    .optional(),
});

export const paystackVerifyResponseSchema = z.object({
  status: z.boolean(),
  message: z.string().optional(),
  data: z
    .object({
      status: z.string(),
      reference: z.string().min(1),
      amount: z.number(),
      currency: z.string().min(1),
    })
    .optional(),
});