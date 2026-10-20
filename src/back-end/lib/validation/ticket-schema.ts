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

export const ticketTransactionSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  amount: z.number().positive("Amount must be positive").optional(),
  phoneNumber: z.string().min(7).optional(),
  eventId: z.string().min(2, "Event ID is required"),
  ticketTypeId: z.string().min(2, "TicketType ID is required"),
  quantity: z.number().int().positive("Quantity must be positive").default(1),
  total: z.number().positive("Total must be positive"),
  reference: z.string().min(2, "Reference is required"),
});

export const UpdateticketTransactionSchema = z.object({
  name: z.string().min(2, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().min(7).optional(),
  status: z
    .enum([
      "ABANDONED",
      "FAILED",
      "ONGOING",
      "PENDING",
      "PROCESSING",
      "QUEUED",
      "REVERSED",
      "SUCCESS",
      "USED",
    ])
    .optional(),
});

export const ticketTypEventSchema = z.object({
  eventId: z.string().cuid().min(1, "Ticket EventId is required"),
});

export const ticketTypeIdSchema = z.object({
  id: z.string().cuid().min(1, "Ticket ID is required"),
});

export const referenceSchema = z.object({
  id: z.string().min(1, "Ticket ID is required"),
});

export const quantitySchema = z.object({
  quantity: z.number().int().positive("Quantity must be positive").default(1),
});
