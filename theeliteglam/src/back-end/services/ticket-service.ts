import { ticketTypeRepo } from "../models/ticket-type-models";
import { ticketRepo } from "../models/ticket-model";
import type { Ticket, UpdateTicket } from "../types/tickets";
import {
  ticketSchema,
  UpdateTicketSchema,
  ticketTypEventSchema,
  referenceSchema,
  ticketTypeIdSchema,
} from "../lib/validation/ticket-schema";
import { formatZodError } from "../lib/utils/helper";

export class TicketService {
  async calculateTicketPrice(price: number, quantity: number) {
    const unitPrice = price;
    const total = price * quantity;
    const paystackAmount = price * quantity * 100;
    return {
      unitPrice,
      total,
      paystackAmount,
    };
  }

  async createTicket(data: Ticket) {
    try {
      const validation = ticketSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const ticket = await ticketRepo.create(validation.data);

      return {
        success: true,
        message: "Ticket created but pending ",
        data: ticket,
        status: 201,
      };
    } catch (error) {
      console.error("Create ticket error:", error);
      return { success: false, error: error || "Failed to create ticket", status: 500 };
    }
  }

  async getTicketsByEvent(eventId: string) {
    try {
      const validation = ticketTypEventSchema.safeParse({ eventId });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const tickets = await ticketRepo.findByEventId(validation.data.eventId);
      return { success: true, data: tickets, status: 200 };
    } catch (error) {
      console.error("Get tickets error:", error);
      return { success: false, error: error || "Failed to fetch tickets", status: 500 };
    }
  }

  async getTicketByReference(reference: string) {
    try {
      const validation = referenceSchema.safeParse({ id: reference });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const ticket = await ticketRepo.findByreference(validation.data.id);
      if (!ticket) {
        return { success: false, error: "Ticket not found", status: 404 };
      }

      return { success: true, data: ticket, status: 200 };
    } catch (error) {
      console.error("Get ticket error:", error);
      return { success: false, error: error || "Failed to fetch ticket", status: 500 };
    }
  }

  async updateTicket(reference: string, data: UpdateTicket) {
    try {
      //if (!["SUPER_ADMIN"].includes(currentUserRole)) {
      // return { success: false, error: "Access denied.", status: 403 };
      //}

      const validation = referenceSchema.safeParse({ id: reference });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const validation2 = UpdateTicketSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error), status: 400 };
      }

      const updatedTicket = await ticketRepo.update(validation.data.id, validation2.data);
      return {
        success: true,
        message: "Ticket updated successfully",
        data: updatedTicket,
        status: 200,
      };
    } catch (error) {
      console.error("Update ticket error:", error);
      return { success: false, error: error || "Failed to update ticket", status: 500 };
    }
  }
}

export const ticketService = new TicketService();
