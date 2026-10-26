import { sponsorModel } from "../models/sponsor-model";
import type { CreateSponsorInput, UpdateSponsorInput } from "../types/sponsor-types";
import {
  createSponsorSchema,
  updateSponsorSchema,
  sponsorIdParamSchema,
  eventIdSchema,
} from "../lib/validation/sponsor-schema";

import { formatZodError } from "../lib/utils/helper";

export class SponsorService {
  async createSponsor(data: CreateSponsorInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        return { success: false, message: "Access denied.", status: 403 };
      }
      const validation = createSponsorSchema.safeParse(data);
      if (!validation.success) {
        return { status: 400, success: false, message: formatZodError(validation.error) };
      }

      const sponsor = await sponsorModel.create(validation.data);

      return {
        status: 200,
        success: true,
        message: "Sponsor created successfully",
        data: sponsor,
      };
    } catch (error) {
      console.error("Create sponsor error:", error);
      return { success: false, message: "Failed to create sponsor. Please try again.", status: 500 };
    }
  }

  async getSponsorsByEvent(eventId: string) {
    try {
      const validation = eventIdSchema.safeParse({ eventId });
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error), status: 400 };
      }
      const sponsors = await sponsorModel.findByEventId(validation.data.eventId);
      return { success: true, data: sponsors, status: 200 };
    } catch (error) {
      console.error("Get sponsors error:", error);
      return { success: false, message: "Failed to fetch sponsors. Please try again.", status: 500 };
    }
  }

  async getSponsorById(id: string) {
    try {
      const validation = sponsorIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error), status: 400 };
      }
      const sponsor = await sponsorModel.findById(validation.data.id);
      if (!sponsor) {
        return { success: false, message: "Sponsor not found", status: 404 };
      }

      return { success: true, data: sponsor, status: 200 };
    } catch (error) {
      console.error("Get sponsor error:", error);
      return { success: false, message: "Failed to fetch sponsor. Please try again.", status: 500 };
    }
  }

  async updateSponsor(id: string, data: UpdateSponsorInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        return { success: false, message: "Access denied.", status: 403 };
      }
      const validation = sponsorIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error), status: 400 };
      }
      const validation2 = updateSponsorSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, message: formatZodError(validation2.error), status: 400 };
      }

      const sponsor = await sponsorModel.update(validation.data.id, validation2.data);
      return { success: true, message: "Sponsor updated successfully", data: sponsor, status: 200 };
    } catch (error) {
      console.error("Update sponsor error:", error);
      return { success: false, message: "Failed to update sponsor. Please try again.", status: 500 };
    }
  }

  async deleteSponsor(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return { success: false, message: "Only SUPER_ADMIN can delete sponsors.", status: 403 };
      }
      const validation = sponsorIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error), status: 400 };
      }

      await sponsorModel.delete(validation.data.id);
      return { success: true, message: "Sponsor deleted successfully", status: 200 };
    } catch (error) {
      console.error("Delete sponsor error:", error);
      return { success: false, message: "Failed to delete sponsor. Please try again.", status: 500 };
    }
  }
}

export const sponsorService = new SponsorService();
