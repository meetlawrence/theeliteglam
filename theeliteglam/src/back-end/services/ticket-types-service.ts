import { ticketTypeRepo } from "../models/ticket-type-models";
import type { TicketType, UpdateTicketType } from "../types/ticket-types";
import {
  CreateTicketTypeSchema,
  UpdateTicketTypeSchema,
  ticketTypeIdSchema,
  ticketTypEventchema,
} from "../lib/validation/ticket-shema";

import { formatZodError } from "../lib/utils/helper";

export class TicketTypeService {
  async createTicketType(data: TicketType, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        return { success: false, error: "Access denied.", status: 403 };
      }
      const validation = CreateTicketTypeSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const ticketType = await ticketTypeRepo.create(validation.data);

      return {
        success: true,
        message: "Ticket type created successfully",
        data: ticketType,
      };
    } catch (error) {
      console.error("Create ticket type error:", error);
      return { success: false, error: error || "Failed to create ticket type", status: 500 };
    }
  }

  async getTicketTypesByEventId(eventId: string) {
    try {
      const validation = ticketTypEventchema.safeParse({ eventId });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      const ticketTypes = await ticketTypeRepo.findByEventId(validation.data.eventId);
      return { success: true, data: ticketTypes, status: 200 };
    } catch (error) {
      console.error("Get ticket types error:", error);
      return { success: false, error: error || "Failed to fetch events", status: 500 };
    }
  }

  async getTicketTypeById(id: string) {
    try {
      const validation = ticketTypeIdSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      const ticketType = await ticketTypeRepo.findById(validation.data.id);
      if (!ticketType) {
        return { success: false, error: "Ticket type not found", status: 404 };
      }

      return { success: true, data: ticketType, status: 200 };
    } catch (error) {
      console.error("Get event error:", error);
      return { success: false, error: error || "Failed to fetch event", status: 500 };
    }
  }

  async updateTicketType(id: string, data: UpdateTicketType, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        return { success: false, error: "Access denied.", status: 403 };
      }

      const validation = ticketTypeIdSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      const validation2 = UpdateTicketTypeSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error), status: 400 };
      }

      const event = await ticketTypeRepo.update(validation.data.id, validation2.data);
      return {
        success: true,
        message: "Ticket Type updated successfully",
        data: event,
        status: 200,
      };
    } catch (error) {
      console.error("Update Ticket Type error:", error);
      return { success: false, error: error || "Failed to update Ticket Type", status: 500 };
    }
  }

  async deleteTicketTypet(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return { success: false, error: "Only SUPER_ADMIN can delete Ticket Types.", status: 403 };
      }

      const validation = ticketTypeIdSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      await ticketTypeRepo.delete(validation.data.id);
      return { success: true, message: "Ticket Type deleted successfully", status: 200 };
    } catch (error) {
      console.error("Delete Ticket Type error:", error);
      return { success: false, error: error || "Failed to delete Ticket Type", status: 500 };
    }
  }
}

export const ticketTypeService = new TicketTypeService();
