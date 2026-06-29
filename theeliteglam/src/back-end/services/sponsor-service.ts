import { sponsorModel } from "../models/sponsor-model";
import type { CreateSponsorInput, UpdateSponsorInput } from "../types/sponsor-types";

export class SponsorService {
  async createSponsor(data: CreateSponsorInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const sponsor = await sponsorModel.create(data);

      return {
        success: true,
        message: "Sponsor created successfully",
        data: sponsor,
      };
    } catch (error: any) {
      console.error("Create sponsor error:", error);
      return { success: false, error: error.message || "Failed to create sponsor" };
    }
  }

  async getSponsorsByEvent(eventId: string) {
    try {
      const sponsors = await sponsorModel.findByEventId(eventId)
      return { success: true, data: sponsors };
    } catch (error: any) {
      console.error("Get sponsors error:", error);
      return { success: false, error: "Failed to fetch sponsors" };
    }
  }

  async getSponsorById(id: string) {
    try {
      const sponsor = await sponsorModel.findById(id);
      if (!sponsor) throw new Error("Sponsor not found");

      return { success: true, data: sponsor };
    } catch (error: any) {
      console.error("Get sponsor error:", error);
      return { success: false, error: error.message || "Failed to fetch sponsor" };
    }
  }

  async updateSponsor(id: string, data: UpdateSponsorInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const sponsor = await sponsorModel.update(id, data);
      return { success: true, message: "Sponsor updated successfully", data: sponsor };
    } catch (error: any) {
      console.error("Update sponsor error:", error);
      return { success: false, error: error.message || "Failed to update sponsor" };
    }
  }

  async deleteSponsor(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can delete sponsors.");
      }

      await sponsorModel.delete(id);
      return { success: true, message: "Sponsor deleted successfully" };
    } catch (error: any) {
      console.error("Delete sponsor error:", error);
      return { success: false, error: error.message || "Failed to delete sponsor" };
    }
  }
}

export const sponsorService = new SponsorService();