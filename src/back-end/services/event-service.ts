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
        return { success: false, message: "Access denied.", status: 403 };
      }
      const validation = createEventSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error), status: 400 };
      }

      const event = await eventModel.create(validation.data);

      return {
        success: true,
        message: "Event created successfully",
        data: event,
      };
    } catch (error) {
      console.error("Create event error:", error);
      return { success: false, message: "Failed to create event. Please try again.", status: 500 };
    }
  }

  async getAllEvents() {
    try {
      const events = await eventModel.findAll();
      return { success: true, data: events, status: 200 };
    } catch (error) {
      console.error("Get events error:", error);
      return { success: false, message: "Failed to fetch events. Please try again.", status: 500 };
    }
  }

  async getFirstEventId() {
    try {
      const event = await eventModel.findFirstId();
      if (!event) {
        return { success: false, message: "No event found", status: 404 };
      }
      return { success: true, data: event, status: 200 };
    } catch (error) {
      console.error("Get first event error:", error);
      return { success: false, message: "Failed to fetch event", status: 500 };
    }
  }

  async getEventById(id: string) {
    try {
      const validation = eventIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error), status: 400 };
      }
      const event = await eventModel.findById(validation.data.id);
      if (!event) {
        return { success: false, message: "Event not found", status: 404 };
      }

      return { success: true, data: event, status: 200 };
    } catch (error) {
      console.error("Get event error:", error);
      return { success: false, message: "Failed to fetch event. Please try again.", status: 500 };
    }
  }

  async updateEvent(id: string, data: UpdateEventInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        return { success: false, message: "Access denied.", status: 403 };
      }

      const validation = eventIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error), status: 400 };
      }
      const validation2 = updateEventSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, message: formatZodError(validation2.error), status: 400 };
      }

      const event = await eventModel.update(validation.data.id, validation2.data);
      return { success: true, message: "Event updated successfully", data: event, status: 200 };
    } catch (error) {
      console.error("Update event error:", error);
      return { success: false, message: "Failed to update event. Please try again.", status: 500 };
    }
  }

  async deleteEvent(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return { success: false, message: "Only SUPER_ADMIN can delete events.", status: 403 };
      }

      const validation = eventIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error), status: 400 };
      }

      await eventModel.delete(validation.data.id);
      return { success: true, message: "Event deleted successfully", status: 200 };
    } catch (error) {
      console.error("Delete event error:", error);
      return { success: false, message: "Failed to delete event. Please try again.", status: 500 };
    }
  }
}

export const eventService = new EventService();
