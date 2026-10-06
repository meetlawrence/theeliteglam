import { z } from "zod";

const basePaymentSchema = z.object({
  method: z.enum(["PAYSTACK", "OPAY"]),
  eventId: z.string().min(1, "Event ID is required"),
  email: z.string().email("Valid email is required"),
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .optional(),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .optional(),
});

export const initializePaymentSchema = z.discriminatedUnion("purpose", [
  basePaymentSchema.extend({
    purpose: z.literal("TICKET"),
    ticketTypeId: z.string().min(1, "Ticket type ID is required"),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1")
      .max(10, "Maximum 10 tickets allowed"),
  }),
  basePaymentSchema.extend({
    purpose: z.literal("CONTESTANT"),
    name: z
      .string()
      .trim()
      .min(2, "Contestant name is required")
      .max(100, "Name is too long"),
  }),
]);

export const verifyPaymentSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(8, "Reference is required")
    .max(100, "Reference is too long"),
});