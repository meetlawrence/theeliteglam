import {
  describe,
  expect,
  test,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import {
  prisma,
  resetPaymentTables,
  seedMinimalEvent,
  cleanupSeed,
} from "./helpers/db";
import { paymentModel } from "@/back-end/models/payment-model";

let eventId = "";
let ticketTypeId = "";

async function createPayment(overrides: Record<string, unknown> = {}) {
  return paymentModel.create({
    reference: `TIK-ITEST-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    purpose: "TICKET",
    gateway: "PAYSTACK",
    amount: 3000,
    email: "itest@example.com",
    name: "Itest",
    eventId,
    ticketTypeId,
    quantity: 2,
    ...overrides,
  });
}

describe("payment model (real DB)", () => {
  beforeAll(async () => {
    const seeded = await seedMinimalEvent();
    eventId = seeded.event.id;
    ticketTypeId = seeded.ticketType.id;
  });

  beforeEach(async () => {
    await resetPaymentTables(eventId);
  });

  afterAll(async () => {
    await cleanupSeed(eventId);
    await prisma.$disconnect();
  });

  test("create sets PENDING / PENDING", async () => {
    const tx = await createPayment();

    expect(tx.status).toBe("PENDING");
    expect(tx.fulfillmentStatus).toBe("PENDING");
    expect(Number(tx.amount)).toBe(3000);
  });

  test("duplicate reference hits P2002", async () => {
    const tx = await createPayment();

    await expect(
      paymentModel.create({
        reference: tx.reference,
        purpose: "TICKET",
        gateway: "PAYSTACK",
        amount: 3000,
        email: "other@example.com",
        name: "Other",
        eventId,
        ticketTypeId,
        quantity: 1,
      })
    ).rejects.toMatchObject({ code: "P2002" });
  });

  test("findByReference includes relations", async () => {
    const tx = await createPayment();
    const found = await paymentModel.findByReference(tx.reference);

    expect(found).not.toBeNull();
    expect(found?.event?.id).toBe(eventId);
    expect(found?.tickets).toEqual([]);
  });

  test("markSuccess sets SUCCESS", async () => {
    const tx = await createPayment();
    await paymentModel.markSuccess(tx.reference, "gw_ref_1");

    const found = await paymentModel.findByReference(tx.reference);
    expect(found?.status).toBe("SUCCESS");
    expect(found?.gatewayReference).toBe("gw_ref_1");
  });

  test("markFailed sets FAILED", async () => {
    const tx = await createPayment();
    await paymentModel.markFailed(tx.reference);

    const found = await paymentModel.findByReference(tx.reference);
    expect(found?.status).toBe("FAILED");
  });

  test("claimForFulfillment true only when SUCCESS + PENDING", async () => {
    const pending = await createPayment();
    const claimedWhilePending = await paymentModel.claimForFulfillment(
      pending.reference
    );
    expect(claimedWhilePending).toBe(false);

    await paymentModel.markSuccess(pending.reference, "gw_1");
    const claimed = await paymentModel.claimForFulfillment(pending.reference);
    expect(claimed).toBe(true);

    const found = await paymentModel.findByReference(pending.reference);
    expect(found?.fulfillmentStatus).toBe("PROCESSING");
  });

  test("claimForFulfillment false when already PROCESSING or COMPLETED", async () => {
    const tx = await createPayment();
    await paymentModel.markSuccess(tx.reference, "gw_1");
    await paymentModel.claimForFulfillment(tx.reference);

    const second = await paymentModel.claimForFulfillment(tx.reference);
    expect(second).toBe(false);

    await paymentModel.markFulfilled(tx.reference);
    const third = await paymentModel.claimForFulfillment(tx.reference);
    expect(third).toBe(false);
  });

  test("parallel claim: exactly one true", async () => {
    const tx = await createPayment();
    await paymentModel.markSuccess(tx.reference, "gw_1");

    const results = await Promise.all([
      paymentModel.claimForFulfillment(tx.reference),
      paymentModel.claimForFulfillment(tx.reference),
      paymentModel.claimForFulfillment(tx.reference),
      paymentModel.claimForFulfillment(tx.reference),
      paymentModel.claimForFulfillment(tx.reference),
    ]);

    expect(results.filter(Boolean)).toHaveLength(1);

    const found = await paymentModel.findByReference(tx.reference);
    expect(found?.fulfillmentStatus).toBe("PROCESSING");
  });

  test("resetFulfillmentForRetry only from FAILED", async () => {
    const tx = await createPayment();
    await paymentModel.markSuccess(tx.reference, "gw_1");

    const fromPending = await paymentModel.resetFulfillmentForRetry(
      tx.reference
    );
    expect(fromPending).toBe(false);

    await paymentModel.claimForFulfillment(tx.reference);
    await paymentModel.markFulfillmentFailed(tx.reference);

    const fromFailed = await paymentModel.resetFulfillmentForRetry(
      tx.reference
    );
    expect(fromFailed).toBe(true);

    const found = await paymentModel.findByReference(tx.reference);
    expect(found?.fulfillmentStatus).toBe("PENDING");
  });

  test("findFailedFulfillments only SUCCESS + FAILED", async () => {
    const a = await createPayment();
    const b = await createPayment();
    const c = await createPayment();

    await paymentModel.markSuccess(a.reference, "gw_a");
    await paymentModel.claimForFulfillment(a.reference);
    await paymentModel.markFulfillmentFailed(a.reference);

    await paymentModel.markSuccess(b.reference, "gw_b");
    await paymentModel.claimForFulfillment(b.reference);
    await paymentModel.markFulfilled(b.reference);

    await paymentModel.markFailed(c.reference);

    const failed = await paymentModel.findFailedFulfillments();
    const refs = failed.map((row) => row.reference);

    expect(refs).toContain(a.reference);
    expect(refs).not.toContain(b.reference);
    expect(refs).not.toContain(c.reference);
  });
});