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
        throw new Error("Access denied.");
      }
      const validation = createSponsorSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      const sponsor = await sponsorModel.create(validation.data);

      return {
        success: true,
        message: "Sponsor created successfully",
        data: sponsor,
      };
    } catch (error) {
      console.error("Create sponsor error:", error);
      return { success: false, error: error || "Failed to create sponsor" };
    }
  }

  async getSponsorsByEvent(eventId: string) {
    try {
      const validation = eventIdSchema.safeParse({ eventId });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }
      const sponsors = await sponsorModel.findByEventId(validation.data.eventId);
      return { success: true, data: sponsors };
    } catch (error) {
      console.error("Get sponsors error:", error);
      return { success: false, error: error || "Failed to fetch sponsors" };
    }
  }

  async getSponsorById(id: string) {
    try {
      const validation = sponsorIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }
      const sponsor = await sponsorModel.findById(validation.data.id);
      if (!sponsor) throw new Error("Sponsor not found");

      return { success: true, data: sponsor };
    } catch (error) {
      console.error("Get sponsor error:", error);
      return { success: false, error: error || "Failed to fetch sponsor" };
    }
  }

  async updateSponsor(id: string, data: UpdateSponsorInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }
      const validation = sponsorIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }
      const validation2 = updateSponsorSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error) };
      }

      const sponsor = await sponsorModel.update(validation.data.id, validation2.data);
      return { success: true, message: "Sponsor updated successfully", data: sponsor };
    } catch (error) {
      console.error("Update sponsor error:", error);
      return { success: false, error: error || "Failed to update sponsor" };
    }
  }

  async deleteSponsor(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can delete sponsors.");
      }
      const validation = sponsorIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      await sponsorModel.delete(validation.data.id);
      return { success: true, message: "Sponsor deleted successfully" };
    } catch (error) {
      console.error("Delete sponsor error:", error);
      return { success: false, error: error || "Failed to delete sponsor" };
    }
  }
}

export const sponsorService = new SponsorService();
