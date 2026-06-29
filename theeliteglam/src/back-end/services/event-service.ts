import { eventModel } from "../models/event-model";
import type { CreateEventInput, UpdateEventInput } from "../types/event-types";
import {
  createEventSchema,
  updateEventSchema,
  eventIdParamSchema,
} from "../lib/validation/event-schema";

export class EventService {
  async createEvent(data: CreateEventInput, currentUserRole: string) {
    try {
      const validation = createEventSchema.safeParse(data);
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const event = await eventModel.create(data);

      return {
        success: true,
        message: "Event created successfully",
        data: event,
      };
    } catch (error: any) {
      console.error("Create event error:", error);
      return { success: false, error: error.message || "Failed to create event" };
    }
  }

  async getAllEvents() {
    try {
      const events = await eventModel.findAll();
      return { success: true, data: events };
    } catch (error: any) {
      console.error("Get events error:", error);
      return { success: false, error: "Failed to fetch events" };
    }
  }

  async getEventById(id: string) {
    try {
      const validation = eventIdParamSchema.safeParse({ id });
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      const event = await eventModel.findById(id);
      if (!event) throw new Error("Event not found");

      return { success: true, data: event };
    } catch (error: any) {
      console.error("Get event error:", error);
      return { success: false, error: error.message || "Failed to fetch event" };
    }
  }

  async updateEvent(id: string, data: UpdateEventInput, currentUserRole: string) {
    try {
      let validation = eventIdParamSchema.safeParse({ id });
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      const validation2 = updateEventSchema.safeParse(data);
      if (!validation2.success) {
        const messages = validation2.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const event = await eventModel.update(id, data);
      return { success: true, message: "Event updated successfully", data: event };
    } catch (error: any) {
      console.error("Update event error:", error);
      return { success: false, error: error.message || "Failed to update event" };
    }
  }

  async deleteEvent(id: string, currentUserRole: string) {
    try {
      const validation2 = updateEventSchema.safeParse({ id });
      if (!validation2.success) {
        const messages = validation2.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }

      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can delete events.");
      }

      await eventModel.delete(id);
      return { success: true, message: "Event deleted successfully" };
    } catch (error: any) {
      console.error("Delete event error:", error);
      return { success: false, error: error.message || "Failed to delete event" };
    }
  }
}

export const eventService = new EventService();
