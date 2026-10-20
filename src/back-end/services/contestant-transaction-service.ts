import { contestantTransactionRepo } from "../models/contestant-transaction-model";
import type { ContestantTransaction, UpdateContestantTransaction } from "../types/contestant-transaction-types";
import {
  contestantTransactionSchema,
  updateContestantTransactionSchema,
  referenceSchema,
} from "../lib/validation/contestant-validation";
import {
  eventIdParamSchema,
} from "../lib/validation/event-schema";
import { formatZodError } from "../lib/utils/helper";

export class ContestantTransactionService {
  async calculatePrice(price: number,) {
    const unitPrice = price;
    const paystackAmount = price * 100;
    return {
      unitPrice,
      paystackAmount,
    };
  }

  async createContestantTransaction(data: ContestantTransaction) {
    try {
      const validation = contestantTransactionSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const contestant = await contestantTransactionRepo.create(validation.data);

      return {
        success: true,
        message: "Contestant created but pending ",
        data: contestant,
        status: 201,
      };
    } catch (error) {
      console.error("Create Contestant error:", error);
      return { success: false, error: error || "Failed to create Contestant", status: 500 };
    }
  }

  async getContestantTransactionByEvent(eventId: string) {
    try {
      const validation = eventIdParamSchema.safeParse({ eventId });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const contestants = await contestantTransactionRepo.findByEventId(validation.data.id);
      return { success: true, data: contestants, status: 200 };
    } catch (error) {
      console.error("Get Contestants error:", error);
      return { success: false, error: error || "Failed to fetch Contestants", status: 500 };
    }
  }

  async getContestantTransactionByReference(reference: string) {
    try {
      const validation = referenceSchema.safeParse({ id: reference });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const ticket = await contestantTransactionRepo.findByreference(validation.data.id);
      if (!ticket) {
        return { success: false, error: "Contestant not found", status: 404 };
      }

      return { success: true, data: ticket, status: 200 };
    } catch (error) {
      console.error("Get ticket error:", error);
      return { success: false, error: error || "Failed to fetch Contestant", status: 500 };
    }
  }

  async updateContestantTransaction(reference: string, data: UpdateContestantTransaction) {
    try {
      //if (!["SUPER_ADMIN"].includes(currentUserRole)) {
      // return { success: false, error: "Access denied.", status: 403 };
      //}

      const validation = referenceSchema.safeParse({ id: reference });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const validation2 = updateContestantTransactionSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error), status: 400 };
      }

      const updatedContestant = await contestantTransactionRepo.update(validation.data.id, validation2.data);
      return {
        success: true,
        message: "Contestant updated successfully",
        data: updatedContestant,
        status: 200,
      };
    } catch (error) {
      console.error("Update Contestant error:", error);
      return { success: false, error: error || "Failed to update Contestant", status: 500 };
    }
  }
}
export const contestantTransactionService = new ContestantTransactionService();
