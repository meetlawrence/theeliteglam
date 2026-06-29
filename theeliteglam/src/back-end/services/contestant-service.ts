import { contestantModel } from "../models/contestant-model";
import type { CreateContestantInput, UpdateContestantInput } from "../types/contestant-types";
import {
  createContestantSchema,
  updateContestantSchema,
  contestantIdParamSchema,
} from "../lib/validation/contestant-validation";

import { formatZodError } from "../lib/utils/helper";

export class ContestantService {
  async createContestant(data: CreateContestantInput) {
    try {
      const validation = createContestantSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      const contestant = await contestantModel.create(validation.data);

      return {
        success: true,
        message: "Contestant created successfully",
        data: contestant,
      };
    } catch (error) {
      console.error("Create contestant error:", error);
      return { success: false, error: error || "Failed to create contestant" };
    }
  }

  async getAllContestants() {
    try {
      const contestants = await contestantModel.findAll();
      return { success: true, data: contestants };
    } catch (error) {
      console.error("Get contestants error:", error);
      return { success: false, error: error || "Failed to fetch contestants" };
    }
  }

  async getContestantById(id: string) {
    try {
      const validation = contestantIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      const contestant = await contestantModel.findById(validation.data.id);
      if (!contestant) throw new Error("Contestant not found");

      return { success: true, data: contestant };
    } catch (error) {
      console.error("Get contestant error:", error);
      return { success: false, error: error || "Failed to fetch contestant" };
    }
  }

  async updateContestant(id: string, data: UpdateContestantInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const validation = contestantIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      const validation2 = updateContestantSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error) };
      }

      const contestant = await contestantModel.update(validation.data.id, validation2.data);
      return { success: true, message: "Contestant updated successfully", data: contestant };
    } catch (error) {
      console.error("Update contestant error:", error);
      return { success: false, error: error || "Failed to update contestant" };
    }
  }

  async deleteContestant(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can delete contestants.");
      }

      const validation = contestantIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      await contestantModel.delete(validation.data.id);
      return { success: true, message: "Contestant deleted successfully" };
    } catch (error) {
      console.error("Delete contestant error:", error);
      return { success: false, error: error || "Failed to delete contestant" };
    }
  }
}

export const contestantService = new ContestantService();
