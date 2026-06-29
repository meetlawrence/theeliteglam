import { eventModel } from "../models/event-model";
import type { CreateEventInput, UpdateEventInput } from "../types/event-types";
import {
  createEventSchema,
  updateEventSchema,
  eventIdParamSchema,
} from "../lib/validation/event-schema";

import { formatZodError } from "../lib/utils/helper";

export class EventService {
  async createEvent(data: CreateEventInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }
      const validation = createEventSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      const event = await eventModel.create(validation.data);

      return {
        success: true,
        message: "Event created successfully",
        data: event,
      };
    } catch (error) {
      console.error("Create event error:", error);
      return { success: false, error: error || "Failed to create event" };
    }
  }

  async getAllEvents() {
    try {
      const events = await eventModel.findAll();
      return { success: true, data: events };
    } catch (error) {
      console.error("Get events error:", error);
      return { success: false, error: error || "Failed to fetch events" };
    }
  }

  async getEventById(id: string) {
    try {
      const validation = eventIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }
      const event = await eventModel.findById(validation.data.id);
      if (!event) throw new Error("Event not found");

      return { success: true, data: event };
    } catch (error) {
      console.error("Get event error:", error);
      return { success: false, error: error || "Failed to fetch event" };
    }
  }

  async updateEvent(id: string, data: UpdateEventInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const validation = eventIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }
      const validation2 = updateEventSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error) };
      }

      const event = await eventModel.update(validation.data.id, validation2.data);
      return { success: true, message: "Event updated successfully", data: event };
    } catch (error) {
      console.error("Update event error:", error);
      return { success: false, error: error || "Failed to update event" };
    }
  }

  async deleteEvent(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can delete events.");
      }

      const validation = eventIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      await eventModel.delete(validation.data.id);
      return { success: true, message: "Event deleted successfully" };
    } catch (error) {
      console.error("Delete event error:", error);
      return { success: false, error: error || "Failed to delete event" };
    }
  }
}

export const eventService = new EventService();
