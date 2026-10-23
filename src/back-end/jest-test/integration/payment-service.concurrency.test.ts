import { describe, expect, test, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";

const mockGatewayInitialize = jest.fn(
  (
    _input: Record<string, unknown>,
  ): Promise<{
    success: boolean;
    authorizationUrl?: string;
    accessCode?: string;
    gatewayReference?: string;
  }> =>
    Promise.resolve({
      success: true,
      authorizationUrl: "https://checkout.paystack.com/test",
      accessCode: "access_test",
      gatewayReference: "gw_init",
    }),
);

const mockGatewayVerify = jest.fn(
  (
    _reference: string,
  ): Promise<{
    success: boolean;
    status: "SUCCESS" | "FAILED" | "PENDING";
    amount: number;
    currency?: string;
    gatewayReference?: string;
  }> =>
    Promise.resolve({
      success: true,
      status: "SUCCESS",
      amount: 3000,
      currency: "NGN",
      gatewayReference: "gw_verify",
    }),
);

const mockSendEmail = jest.fn(
  (_to: string, _payload: Record<string, unknown>): Promise<{ success: boolean }> =>
    Promise.resolve({ success: true }),
);

jest.unstable_mockModule("@/back-end/services/payment-services/paystack-gateway", () => ({
  paystackGateway: {
    initialize: (input: Record<string, unknown>) => mockGatewayInitialize(input),
    verify: (reference: string) => mockGatewayVerify(reference),
  },
}));

jest.unstable_mockModule("@/back-end/services/payment-services/opay-gateway", () => ({
  opayGateway: {
    initialize: jest.fn(),
    verify: jest.fn(),
  },
}));

jest.unstable_mockModule("@/back-end/lib/email/resend", () => ({
  sendEmail: (to: string, payload: Record<string, unknown>) => mockSendEmail(to, payload),
}));

jest.unstable_mockModule("@/back-end/db/cloudinary", () => ({
  uploadQRCode: () => Promise.resolve("https://cdn.example.com/qr.png"),
}));

jest.unstable_mockModule("qrcode", () => ({
  default: {
    toDataURL: () => Promise.resolve("data:image/png;base64,AAA"),
  },
}));

const { prisma, resetPaymentTables, seedMinimalEvent, cleanupSeed } = await import("./helpers/db");
const { paymentService } = await import("@/back-end/services/payment-services/payment-service");
const { paymentModel } = await import("@/back-end/models/payment-model");
const { claimIdempotencyKey } = await import("@/back-end/lib/utils/idempotency");
const { TEST_IDEM_PREFIX } = await import("./helpers/db");

let eventId = "";
let ticketTypeId = "";

describe("payment concurrency (real DB)", () => {
  beforeAll(async () => {
    const seeded = await seedMinimalEvent();
    eventId = seeded.event.id;
    ticketTypeId = seeded.ticketType.id;
  });

  beforeEach(async () => {
    await resetPaymentTables(eventId);

    mockGatewayInitialize.mockImplementation(() =>
      Promise.resolve({
        success: true,
        authorizationUrl: "https://checkout.paystack.com/test",
        accessCode: "access_test",
        gatewayReference: "gw_init",
      }),
    );

    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 3000,
        currency: "NGN",
        gatewayReference: "gw_verify",
      }),
    );

    mockSendEmail.mockImplementation(() => Promise.resolve({ success: true }));
  });

  afterAll(async () => {
    await cleanupSeed(eventId);
    await prisma.$disconnect();
  });

  test("parallel claimForFulfillment: exactly one true", async () => {
    const tx = await paymentModel.create({
      reference: `TIK-ITEST-${Date.now()}-claim`,
      purpose: "TICKET",
      gateway: "PAYSTACK",
      amount: 3000,
      email: "conc@example.com",
      name: "Conc",
      eventId,
      ticketTypeId,
      quantity: 2,
    });
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

  test("parallel verify same ticket payment: exactly quantity tickets, one email", async () => {
    const init = await paymentService.initialize({
      purpose: "TICKET",
      method: "PAYSTACK",
      eventId,
      ticketTypeId,
      quantity: 2,
      email: "conc-verify@example.com",
      name: "Conc Verify",
    });

    expect(init.success).toBe(true);
    const reference = init.data.reference as string;

    const results = await Promise.all([
      paymentService.verify(reference),
      paymentService.verify(reference),
      paymentService.verify(reference),
      paymentService.verify(reference),
      paymentService.verify(reference),
    ]);

    expect(results.every((r) => r.success)).toBe(true);

    const done = await paymentModel.findByReference(reference);
    expect(done?.status).toBe("SUCCESS");
    expect(done?.fulfillmentStatus).toBe("COMPLETED");

    const tickets = await prisma.ticket.findMany({
      where: { paymentTransactionId: done!.id },
    });
    expect(tickets).toHaveLength(2);

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  test("parallel verify same contestant payment: one form email", async () => {
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 5000,
        currency: "NGN",
        gatewayReference: "gw_verify",
      }),
    );

    const init = await paymentService.initialize({
      purpose: "CONTESTANT",
      method: "PAYSTACK",
      eventId,
      email: "conc-con@example.com",
      name: "Conc Contestant",
    });

    const reference = init.data.reference as string;

    const results = await Promise.all([
      paymentService.verify(reference),
      paymentService.verify(reference),
      paymentService.verify(reference),
      paymentService.verify(reference),
    ]);

    expect(results.every((r) => r.success)).toBe(true);

    const done = await paymentModel.findByReference(reference);
    expect(done?.status).toBe("SUCCESS");
    expect(done?.fulfillmentStatus).toBe("COMPLETED");
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  test("parallel initialize with same idempotency key: one payment row", async () => {
    const key = `${TEST_IDEM_PREFIX}init-${Date.now()}`;

    const claims = await Promise.all([
      claimIdempotencyKey({
        key,
        method: "POST",
        path: "/api/payments/initialize",
      }),
      claimIdempotencyKey({
        key,
        method: "POST",
        path: "/api/payments/initialize",
      }),
      claimIdempotencyKey({
        key,
        method: "POST",
        path: "/api/payments/initialize",
      }),
    ]);

    expect(claims.filter((c) => c.claimed)).toHaveLength(1);

    const winner = claims.find((c) => c.claimed);
    expect(winner).toEqual({ claimed: true });

    const rows = await prisma.idempotencyKey.findMany({ where: { key } });
    expect(rows).toHaveLength(1);
  });
});
