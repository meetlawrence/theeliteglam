import { describe, expect, test, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { prisma, resetPaymentTables, seedMinimalEvent, cleanupSeed } from "./helpers/db";
import { paymentModel } from "@/back-end/models/payment-model";

let eventId = "";

async function createContestantPayment() {
  const tx = await paymentModel.create({
    reference: `CON-ITEST-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    purpose: "CONTESTANT",
    gateway: "PAYSTACK",
    amount: 5000,
    email: "itest-contestant@example.com",
    name: "Itest Contestant",
    eventId,
    ticketTypeId: null,
    quantity: null,
  });

  await paymentModel.markSuccess(tx.reference, "gw_con");
  return tx;
}

function contestantData(
  payment: { id: string; reference: string },
  overrides: Record<string, unknown> = {},
) {
  return {
    name: "Itest Contestant",
    email: "itest-contestant@example.com",
    gender: "FEMALE" as const,
    phone: "08012345678",
    reference: payment.reference,
    eventId,
    paymentTransactionId: payment.id,
    age: 20,
    state: "Lagos",
    country: "Nigeria",
    occupation: "Student",
    advocacy: "Education",
    funFact: "Enjoys reading",
    tribe: "Yoruba",
    contestantCategories: "FEMALE" as const,
    ...overrides,
  };
}

describe("contestant uniqueness (real DB)", () => {
  beforeAll(async () => {
    const seeded = await seedMinimalEvent();
    eventId = seeded.event.id;
  });

  beforeEach(async () => {
    await resetPaymentTables(eventId);
  });

  afterAll(async () => {
    await cleanupSeed(eventId);
    await prisma.$disconnect();
  });

  test("creates contestant linked to payment", async () => {
    const payment = await createContestantPayment();

    const contestant = await prisma.contestant.create({
      data: contestantData(payment),
    });

    expect(contestant.reference).toBe(payment.reference);
    expect(contestant.paymentTransactionId).toBe(payment.id);
    expect(contestant.eventId).toBe(eventId);

    const found = await paymentModel.findByReference(payment.reference);
    expect(found?.contestant?.id).toBe(contestant.id);
  });

  test("duplicate contestant.reference hits P2002", async () => {
    const a = await createContestantPayment();
    const b = await createContestantPayment();

    await prisma.contestant.create({
      data: contestantData(a),
    });

    await expect(
      prisma.contestant.create({
        data: contestantData(b, {
          reference: a.reference,
          email: "other@example.com",
        }),
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  test("duplicate paymentTransactionId hits P2002", async () => {
    const payment = await createContestantPayment();
    const duplicatePaymentReference = `${payment.reference}-2`;

    await prisma.contestant.create({
      data: contestantData(payment),
    });

    await expect(
      prisma.contestant.create({
        data: contestantData(payment, {
          reference: duplicatePaymentReference,
          email: "other@example.com",
        }),
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  test("two payments can each have one contestant", async () => {
    const a = await createContestantPayment();
    const b = await createContestantPayment();

    await prisma.contestant.create({
      data: contestantData(a, { email: "a@example.com" }),
    });
    await prisma.contestant.create({
      data: contestantData(b, { email: "b@example.com" }),
    });

    const count = await prisma.contestant.count({ where: { eventId } });
    expect(count).toBe(2);
  });
});
