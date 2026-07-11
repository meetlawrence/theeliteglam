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

export const ticketTypEventchema = z.object({
  eventId: z.string().cuid().min(1, "Ticket EventId is required"),
});

export const ticketTypeIdSchema = z.object({
  id: z.string().cuid().min(1, "Ticket ID is required"),
});
