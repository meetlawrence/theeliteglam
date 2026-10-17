import { contestantModel } from "../models/contestant-model";
import { contestantTransactionRepo } from "../models/contestant-transaction-model";
import type { CreateContestantInput, UpdateContestantInput } from "../types/contestant-types";
import { ContestantTransactionStatus } from "../types/contestant-transaction-types";
import {
  createContestantSchema,
  updateContestantSchema,
  contestantIdParamSchema,
  referenceSchema,
} from "../lib/validation/contestant-validation";

import { formatZodError } from "../lib/utils/helper";
import { eventIdSchema } from "../lib/validation/sponsor-schema";
import { sendEmail } from "../lib/email/resend";


export class ContestantService {
  async createContestant(data: CreateContestantInput) {
    try {
      const validation = createContestantSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const existing = await contestantModel.findByEmail(validation.data.email);
      if (existing) {
        return { success: false, error: "Contestant with this email already exists.", status: 400 };
      }
      console.log("result", existing);

      const contestant = await contestantModel.create(validation.data);

      if (validation.data.reference) {
        await contestantTransactionRepo.update(validation.data.reference, {
          formSent: true, 
        });
      }

      return {
        success: true,
        message: "Contestant created successfully",
        data: contestant,
      };
    } catch (error) {
      console.error("Create contestant error:", error);
      return { success: false, error: error || "Failed to create contestant", status: 500 };
    }
  }

  async getAllContestants() {
    try {
      const contestants = await contestantModel.findAll();
      return { success: true, data: contestants };
    } catch (error) {
      console.error("Get contestants error:", error);
      return { success: false, error: error || "Failed to fetch contestants", status: 500 };
    }
  }

  async getContestantById(id: string) {
    try {
      const validation = contestantIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const contestant = await contestantModel.findById(validation.data.id);
      if (!contestant) {
        return { success: false, error: "Contestant not found", status: 404 };
      }

      return { success: true, data: contestant };
    } catch (error) {
      console.error("Get contestant error:", error);
      return { success: false, error: error || "Failed to fetch contestant", status: 500 };
    }
  }

  async getContestantByreference(reference: string) {
    try {

      const validation = referenceSchema.safeParse({ id: reference });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      const contestant = await contestantModel.findByreference(validation.data.id);
      if (!contestant) {
        return { success: false, error: "Contestant not found", status: 404 };
      }

      return { success: true, data: contestant };
    } catch (error) {
      console.error("Get contestant error:", error);
      return { success: false, error: error || "Failed to fetch contestant", status: 500 };
    }
  }

  async updateContestant(id: string, data: UpdateContestantInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        return { success: false, error: "Access denied.", status: 403 };
      }

      const validation = contestantIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      const validation2 = updateContestantSchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error), status: 400 };
      }

      const contestant = await contestantModel.update(validation.data.id, validation2.data);
      return {
        success: true,
        message: "Contestant updated successfully",
        data: contestant,
        status: 200,
      };
    } catch (error) {
      console.error("Update contestant error:", error);
      return { success: false, error: error || "Failed to update contestant", status: 500 };
    }
  }

  async getContestantsByEvent(eventId: string) {
    try {
      const validation = eventIdSchema.safeParse({ eventId });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }
      const contestants = await contestantModel.findByEventId(validation.data.eventId);
      return { success: true, data: contestants, status: 200 };
    } catch (error) {
      console.error("Get contestants error:", error);
      return { success: false, error: error || "Failed to fetch contestants", status: 500 };
    }
  }

  async deleteContestant(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return { success: false, error: "Only SUPER_ADMIN can delete contestants.", status: 403 };
      }

      const validation = contestantIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error), status: 400 };
      }

      await contestantModel.delete(validation.data.id);
      return { success: true, message: "Contestant deleted successfully", status: 200 };
    } catch (error) {
      console.error("Delete contestant error:", error);
      return { success: false, error: error || "Failed to delete contestant", status: 500 };
    }
  }

  async resendContestantFormLink(reference: string) {
    try {
      // 1. Validate reference
      const validation = referenceSchema.safeParse({ id: reference });
      if (!validation.success) {
        return {
          success: false,
          error: formatZodError(validation.error),
          status: 400,
        };
      }

      // 2. Find the Contestant Transaction
      const contestantTransaction = await contestantTransactionRepo.findByreference(reference);

      if (!contestantTransaction) {
        return {
          success: false,
          error: "Record not found",
          status: 404,
        };
      }

      // 3. If already claimed → stop
      if (contestantTransaction.formSent == true) {
        return {
          success: false,
          error: "Contestant form link has already been sent to your email",
          status: 400,
        };
      }

      if (contestantTransaction.status !== "SUCCESS") {
      return {
        success: false,
        error: "Payment has not been completed or verified yet.",
        status: 400,
      };
    }

      // 4. Generate the form link
      const formLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register/form?reference=${contestantTransaction.reference}`;

      // 5. Send email
      const emailResult = await sendEmail(contestantTransaction.email, {
        type: "contestant-form",
        props: {
          firstName: contestantTransaction.name.split(" ")[0] || contestantTransaction.name,
          formLink,
          reference: contestantTransaction.reference,
          eventName: "The Elite Glam Pageant Season 2", 
        },
      });

      // 6. Mark as claimed only if email succeeded
      if (emailResult.success) {
        await contestantTransactionRepo.update(reference, {
          formSent : true,
          status: "SUCCESS" as ContestantTransactionStatus,
        });

        return {
          success: true,
          message: "Contestant form link has been sent to your email",
          emailSent: true,
        };
      }

      // Email failed
      return {
        success: false,
        error: "Contestant form link generated but email failed. Please try again.",
        status: 500,
      };
    } catch (error: any) {
      console.error("[ContestantService.resendContestantFormLink]", error);

      return {
        success: false,
        error: "Failed to send contestant form link",
        status: 500,
      };
    }
  }
}

export const contestantService = new ContestantService();
