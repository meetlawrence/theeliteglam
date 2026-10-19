import { z } from "zod";

export const CreateTicketTypeSchema = z.object({
  name: z.string().min(2, "Ticket name is required"),
  price: z.number().positive("Price must be positive"),
  capacity: z.number().positive().optional(),
  benefits: z.array(z.string().min(2)).min(1, "At least one benefit required"),
  eventId: z.string().cuid("Invalid event ID"),
});

export const UpdateTicketTypeSchema = z.object({
  name: z.string().min(2, "Ticket name is required").optional(),
  price: z.number().positive("Price must be positive").optional(),
  capacity: z.number().positive().optional(), // allow null or omit
  benefits: z.array(z.string().min(2)).min(1, "At least one benefit required").optional(),
});

export const ticketTypEventSchema = z.object({
  eventId: z.string().cuid().min(1, "Ticket EventId is required"),
});

export const ticketTypeIdSchema = z.object({
  id: z.string().cuid().min(1, "Ticket ID is required"),
});

export const referenceSchema = z.object({
  id: z
    .string()
    .trim()
    .min(8, "Reference is required")
    .max(100, "Reference is too long"),
});

export const confirmTicketSchema = z.object({
  token: z.string().min(10, "Invalid ticket token"),
});

export const quantitySchema = z.object({
  quantity: z.number().int().positive("Quantity must be positive").default(1),
});

export const ticketInitSchema = z.object({
  eventId: z.string().min(1),
  ticketTypeId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  name: z.string().optional(),
});