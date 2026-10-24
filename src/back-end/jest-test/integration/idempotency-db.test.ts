import { describe, expect, test, beforeAll, afterAll, beforeEach } from "@jest/globals";
import { prisma } from "@/back-end/db/db-connect";
import { resetPaymentTables, seedMinimalEvent, cleanupSeed, TEST_IDEM_PREFIX } from "./helpers/db";
import { claimIdempotencyKey } from "@/back-end/lib/utils/idempotency";

let eventId = "";

describe("Idempotency DB constraints (Prisma integration)", () => {
  beforeAll(async () => {
    // Seed a minimal event before tests
    const seeded = await seedMinimalEvent();
    eventId = seeded.event.id;
  });

  beforeEach(async () => {
    // Reset payment tables before each test
    await resetPaymentTables(eventId);
  });

  afterAll(async () => {
    // Clean up seeded data and disconnect Prisma
    await cleanupSeed(eventId);
  });

  test("duplicate key insert hits P2002", async () => {
    const key = `${TEST_IDEM_PREFIX}dup-${Date.now()}`;

    await prisma.idempotencyKey.create({
      data: {
        key,
        method: "POST",
        path: "/api/payments/initialize",
        statusCode: 0,
        response: {},
        expiresAt: new Date(Date.now() + 60_000),
      },
    });

    await expect(
      prisma.idempotencyKey.create({
        data: {
          key,
          method: "POST",
          path: "/api/payments/initialize",
          statusCode: 0,
          response: {},
          expiresAt: new Date(Date.now() + 60_000),
        },
      }),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  test("claim: first true, second false", async () => {
    const key = `${TEST_IDEM_PREFIX}claim-${Date.now()}`;

    const first = await claimIdempotencyKey({
      key,
      method: "POST",
      path: "/api/payments/initialize",
    });
    const second = await claimIdempotencyKey({
      key,
      method: "POST",
      path: "/api/payments/initialize",
    });

    expect(first).toEqual({ claimed: true });
    expect(second).toEqual({ claimed: false });
  });

  test("parallel claims: exactly one winner", async () => {
    const key = `${TEST_IDEM_PREFIX}parallel-${Date.now()}`;

    const results = await Promise.all([
      claimIdempotencyKey({ key, method: "POST", path: "/api/payments/initialize" }),
      claimIdempotencyKey({ key, method: "POST", path: "/api/payments/initialize" }),
      claimIdempotencyKey({ key, method: "POST", path: "/api/payments/initialize" }),
      claimIdempotencyKey({ key, method: "POST", path: "/api/payments/initialize" }),
    ]);

    // Only one should succeed
    expect(results.filter((r) => r.claimed)).toHaveLength(1);

    // DB should only have one row for that key
    const rows = await prisma.idempotencyKey.findMany({ where: { key } });
    expect(rows).toHaveLength(1);
  });
});
