import { contestantModel } from "@/back-end/models/contestant-model";
import { formatZodError } from "@/back-end/lib/utils/helper";
import { sendEmail } from "@/back-end/lib/email/resend";
import {
  createContestantSchema,
  updateContestantSchema,
  contestantIdParamSchema,
  referenceSchema,
  eventIdSchema,
} from "@/back-end/lib/validation/contestant-validation";
import { paymentModel } from "../models/payment-model";
import { CreateContestantInput, UpdateContestantInput } from "@/back-end/types/contestant-types";
import { prisma } from "@/back-end/db/db-connect";


export class ContestantService {
  async createContestant(data: CreateContestantInput, reference: string) {
    try {
      const validation = createContestantSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        };
      }

      const existing = await contestantModel.findByEmail(validation.data.email);
      if (existing) {
        return {
          success: false,
          message: "Contestant with this email already exists",
          status: 400,
        };
      }

      const contestant = await contestantModel.create(validation.data);
      await paymentModel.markFulfilled(reference);
      return {
        success: true,
        message: "Contestant created successfully",
        data: contestant,
        status: 201,
      };
    } catch (error: unknown) {
      console.error("[ContestantService.createContestant]", error);
      return {
        success: false,
        message: (error as Error).message || "Failed to create contestant",
        status: 500,
      };
    }
  }

  async getAllContestants() {
    try {
      const contestants = await contestantModel.findAll();
      return {
        success: true,
        data: contestants,
        status: 200,
      };
    } catch (error: unknown) {
      console.error("[ContestantService.getAllContestants]", error);
      return {
        success: false,
        message: (error as Error).message || "Failed to fetch contestants",
        status: 500,
      };
    }
  }

  async getContestantById(id: string) {
    try {
      const validation = contestantIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        };
      }

      const contestant = await contestantModel.findById(validation.data.id);
      if (!contestant) {
        return {
          success: false,
          message: "Contestant not found",
          status: 404,
        };
      }

      return {
        success: true,
        data: contestant,
        status: 200,
      };
    } catch (error: unknown) {
      console.error("[ContestantService.getContestantById]", error);
      return {
        success: false,
        message: (error as Error).message || "Failed to fetch contestant",
        status: 500,
      };
    }
  }

  async getContestantByReference(reference: string) {
    try {
      const validation = referenceSchema.safeParse({ id: reference });
      if (!validation.success) {
        return {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        };
      }

      const contestant = await contestantModel.findByReference(validation.data.id);
      if (!contestant) {
        return {
          success: false,
          message: "Contestant not found",
          status: 404,
        };
      }

      return {
        success: true,
        data: contestant,
        status: 200,
      };
    } catch (error: unknown) {
      console.error("[ContestantService.getContestantByReference]", error);
      return {
        success: false,
        message: (error as Error).message || "Failed to fetch contestant",
        status: 500,
      };
    }
  }

  async getContestantsByEvent(eventId: string) {
    try {
      const validation = eventIdSchema.safeParse({ eventId });
      if (!validation.success) {
        return {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        };
      }

      const contestants = await contestantModel.findByEventId(validation.data.eventId);

      return {
        success: true,
        data: contestants,
        status: 200,
      };
    } catch (error: unknown) {
      console.error("[ContestantService.getContestantsByEvent]", error);
      return {
        success: false,
        message: (error as Error).message || "Failed to fetch contestants",
        status: 500,
      };
    }
  }

  async updateContestant(id: string, data: UpdateContestantInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        return {
          success: false,
          message: "Access denied",
          status: 403,
        };
      }

      const idValidation = contestantIdParamSchema.safeParse({ id });
      if (!idValidation.success) {
        return {
          success: false,
          message: formatZodError(idValidation.error),
          status: 400,
        };
      }

      const dataValidation = updateContestantSchema.safeParse(data);
      if (!dataValidation.success) {
        return {
          success: false,
          message: formatZodError(dataValidation.error),
          status: 400,
        };
      }

      const contestant = await contestantModel.update(idValidation.data.id, dataValidation.data);

      return {
        success: true,
        message: "Contestant updated successfully",
        data: contestant,
        status: 200,
      };
    } catch (error: unknown) {
      console.error("[ContestantService.updateContestant]", error);
      return {
        success: false,
        message: (error as Error).message || "Failed to update contestant",
        status: 500,
      };
    }
  }

  async deleteContestant(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        return {
          success: false,
          message: "Only SUPER_ADMIN can delete contestants",
          status: 403,
        };
      }

      const validation = contestantIdParamSchema.safeParse({ id });
      if (!validation.success) {
        return {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        };
      }

      await contestantModel.delete(validation.data.id);

      return {
        success: true,
        message: "Contestant deleted successfully",
        status: 200,
      };
    } catch (error: unknown) {
      console.error("[ContestantService.deleteContestant]", error);
      return {
        success: false,
        message: (error as Error).message || "Failed to delete contestant",
        status: 500,
      };
    }
  }

  async sendContestantFormLink(reference: string) {
    try {
      const validation = referenceSchema.safeParse({ id: reference });
      if (!validation.success) {
        return {
          success: false,
          message: formatZodError(validation.error),
          status: 400,
        };
      }

      const payment = await prisma.paymentTransaction.findUnique({
        where: { reference: validation.data.id },
      });

      if (!payment) {
        return {
          success: false,
          message: "Payment record not found",
          status: 404,
        };
      }

      if (payment.purpose !== "CONTESTANT") {
        return {
          success: false,
          message: "This reference is not for a contestant payment",
          status: 400,
        };
      }

      if (payment.status !== "SUCCESS") {
        return {
          success: false,
          message: "Payment has not been completed yet",
          status: 400,
        };
      }

      const formLink = `${process.env.NEXT_PUBLIC_BASE_URL}/register/form?reference=${payment.reference}`;

      const emailResult = await sendEmail(payment.email, {
        type: "contestant-form",
        props: {
          firstName: (payment.name || "Contestant").split(" ")[0],
          formLink,
          reference: payment.reference,
          eventName: "The Elite Glam",
        },
      });

      if (!emailResult.success) {
        return {
          success: false,
          message: "Failed to send form link email",
          status: 500,
        };
      }

      return {
        success: true,
        message: "Contestant form link has been sent to your email",
        status: 200,
      };
    } catch (error: unknown) {
      console.error("[ContestantService.sendContestantFormLink]", error);
      return {
        success: false,
        message: (error as Error).message || "Failed to send contestant form link",
        status: 500,
      };
    }
  }

 async resendContestantFormLink(reference: string) {
  try {
    const payment = await prisma.paymentTransaction.findUnique({
      where: { reference: reference},
    });

    if (!payment) {
      return {
        success: false,
        message: "Payment record not found",
        status: 404,
      };
    }

    if (payment.purpose !== "CONTESTANT") {
      return {
        success: false,
        message: "This reference is not for a contestant payment",
        status: 400,
      };
    }

    if (payment.status !== "SUCCESS") {
      return {
        success: false,
        message: "Payment has not been completed yet",
        status: 400,
      };
    }

    const rateLimitKey = `resend-form:${payment.reference}`;

    // 1. Check recent resend (last 2 minutes)
    const recent = await prisma.idempotencyKey.findUnique({
      where: { key: rateLimitKey },
    });

    if (recent && recent.createdAt > new Date(Date.now() - 10 * 60 * 1000)) {
      return {
        success: false,
        message: "Please wait a few minutes before requesting another link",
        status: 429,
      };
    }

    // 2. Send email
    const formLink = `${process.env.NEXT_PUBLIC_BASE_URL}/contestant/form?reference=${payment.reference}`;

    const emailResult = await sendEmail(payment.email, {
      type: "contestant-form",
      props: {
        firstName: (payment.name || "Contestant").split(" ")[0],
        formLink,
        reference: payment.reference,
        eventName: "The Elite Glam",
      },
    });

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send form link email",
        status: 500,
      };
    }

    // 3. Upsert rate-limit record (works for first and later resends)
    await prisma.idempotencyKey.upsert({
      where: { key: rateLimitKey },
      create: {
        key: rateLimitKey,
        method: "POST",
        path: "/api/contestants/resend-form",
        statusCode: 200,
        response: { sent: true, at: new Date().toISOString() },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      update: {
        statusCode: 200,
        response: { sent: true, at: new Date().toISOString() },
        createdAt: new Date(), // reset window
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      success: true,
      message: "Contestant form link has been resent",
      status: 200,
    };
  } catch (error: unknown) {
    console.error("[ContestantService.resendContestantFormLink]", error);
    return {
      success: false,
      message: (error as Error).message || "Failed to resend contestant form link",
      status: 500,
    };
  }
}
}

export const contestantService = new ContestantService();