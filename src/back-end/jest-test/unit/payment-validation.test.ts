import { describe, expect, test } from "@jest/globals";
import {
  initializePaymentSchema,
  verifyPaymentSchema,
} from "@/back-end/lib/validation/payment-validation";

describe("initializePaymentSchema", () => {
  const validTicket = {
    purpose: "TICKET" as const,
    method: "PAYSTACK" as const,
    eventId: "event_123",
    ticketTypeId: "ticket_type_123",
    quantity: 2,
    email: "buyer@example.com",
    phoneNumber: "08012345678",
    name: "Jane Doe",
  };

  const validContestant = {
    purpose: "CONTESTANT" as const,
    method: "PAYSTACK" as const,
    eventId: "event_123",
    email: "contestant@example.com",
    name: "Jane Doe",
    phoneNumber: "08012345678",
  };

  test("accepts valid TICKET payload", () => {
    const result = initializePaymentSchema.safeParse(validTicket);
    expect(result.success).toBe(true);
  });

  test("accepts valid CONTESTANT payload", () => {
    const result = initializePaymentSchema.safeParse(validContestant);
    expect(result.success).toBe(true);
  });

  test("rejects empty body", () => {
    const result = initializePaymentSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  test("rejects missing purpose", () => {
    const { purpose, ...rest } = validTicket;
    const result = initializePaymentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  test("rejects missing method", () => {
    const { method, ...rest } = validTicket;
    const result = initializePaymentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  test("rejects missing eventId", () => {
    const { eventId, ...rest } = validTicket;
    const result = initializePaymentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  test("rejects invalid email", () => {
    const result = initializePaymentSchema.safeParse({
      ...validTicket,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  test("rejects invalid method", () => {
    const result = initializePaymentSchema.safeParse({
      ...validTicket,
      method: "STRIPE",
    });
    expect(result.success).toBe(false);
  });

  test("TICKET: rejects missing ticketTypeId", () => {
    const { ticketTypeId, ...rest } = validTicket;
    const result = initializePaymentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  test("TICKET: rejects quantity 0", () => {
    const result = initializePaymentSchema.safeParse({
      ...validTicket,
      quantity: 0,
    });
    expect(result.success).toBe(false);
  });

  test("TICKET: rejects negative quantity", () => {
    const result = initializePaymentSchema.safeParse({
      ...validTicket,
      quantity: -1,
    });
    expect(result.success).toBe(false);
  });

  test("TICKET: rejects quantity above 10", () => {
    const result = initializePaymentSchema.safeParse({
      ...validTicket,
      quantity: 11,
    });
    expect(result.success).toBe(false);
  });

  test("TICKET: rejects non-integer quantity", () => {
    const result = initializePaymentSchema.safeParse({
      ...validTicket,
      quantity: 1.5,
    });
    expect(result.success).toBe(false);
  });

  test("TICKET: rejects quantity as string", () => {
    const result = initializePaymentSchema.safeParse({
      ...validTicket,
      quantity: "2",
    });
    expect(result.success).toBe(false);
  });

  test("CONTESTANT: rejects missing name", () => {
    const { name, ...rest } = validContestant;
    const result = initializePaymentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  test("CONTESTANT: rejects short name", () => {
    const result = initializePaymentSchema.safeParse({
      ...validContestant,
      name: "A",
    });
    expect(result.success).toBe(false);
  });

  test("accepts optional phoneNumber omitted", () => {
    const { phoneNumber, ...rest } = validContestant;
    const result = initializePaymentSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });
});

describe("verifyPaymentSchema", () => {
  test("accepts valid reference", () => {
    const result = verifyPaymentSchema.safeParse({
      reference: "CON-ABCDEF1234567890",
    });
    expect(result.success).toBe(true);
  });

  test("rejects missing reference", () => {
    const result = verifyPaymentSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  test("rejects empty reference", () => {
    const result = verifyPaymentSchema.safeParse({ reference: "" });
    expect(result.success).toBe(false);
  });

  test("rejects short reference", () => {
    const result = verifyPaymentSchema.safeParse({ reference: "ABC" });
    expect(result.success).toBe(false);
  });

  test("rejects oversized reference", () => {
    const result = verifyPaymentSchema.safeParse({
      reference: "X".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});