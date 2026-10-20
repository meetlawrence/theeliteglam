import { describe, expect, test, beforeAll, afterAll, beforeEach, jest } from "@jest/globals";

const mockGatewayInitialize = jest.fn(
  (
    _input: Record<string, unknown>,
  ): Promise<{
    success: boolean;
    authorizationUrl?: string;
    accessCode?: string;
    gatewayReference?: string;
    message?: string;
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
    message?: string;
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

jest.unstable_mockModule("@/back-end/database/cloudinary", () => ({
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

let eventId = "";
let ticketTypeId = "";

describe("payment flow (real DB, mocked Paystack)", () => {
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

    mockGatewayVerify.mockImplementation((_reference: string) =>
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

  test("TICKET: initialize → verify → tickets + COMPLETED", async () => {
    const init = await paymentService.initialize({
      purpose: "TICKET",
      method: "PAYSTACK",
      eventId,
      ticketTypeId,
      quantity: 2,
      email: "flow-ticket@example.com",
      name: "Flow Tester",
    });

    expect(init.success).toBe(true);
    expect(init.data?.reference).toMatch(/^TIK-/);
    expect(init.data?.authorizationUrl).toBe("https://checkout.paystack.com/test");

    const reference = init.data.reference as string;

    const pending = await paymentModel.findByReference(reference);
    expect(pending?.status).toBe("PENDING");
    expect(pending?.fulfillmentStatus).toBe("PENDING");
    expect(Number(pending?.amount)).toBe(3000);

    const verify = await paymentService.verify(reference);

    expect(verify.success).toBe(true);

    const done = await paymentModel.findByReference(reference);
    expect(done?.status).toBe("SUCCESS");
    expect(done?.fulfillmentStatus).toBe("COMPLETED");

    const tickets = await prisma.ticket.findMany({
      where: { paymentTransactionId: done!.id },
    });
    expect(tickets).toHaveLength(2);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  test("TICKET: verify twice does not duplicate tickets", async () => {
    const init = await paymentService.initialize({
      purpose: "TICKET",
      method: "PAYSTACK",
      eventId,
      ticketTypeId,
      quantity: 2,
      email: "flow-dup@example.com",
      name: "Flow Tester",
    });

    const reference = init.data.reference as string;

    await paymentService.verify(reference);
    await paymentService.verify(reference);

    const done = await paymentModel.findByReference(reference);
    const tickets = await prisma.ticket.findMany({
      where: { paymentTransactionId: done!.id },
    });

    expect(tickets).toHaveLength(2);
    expect(done?.fulfillmentStatus).toBe("COMPLETED");
  });

  test("CONTESTANT: initialize → verify → form email + COMPLETED", async () => {
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
      email: "flow-con@example.com",
      name: "Flow Contestant",
    });

    expect(init.success).toBe(true);
    expect(init.data?.reference).toMatch(/^CON-/);

    const reference = init.data.reference as string;
    const pending = await paymentModel.findByReference(reference);
    expect(Number(pending?.amount)).toBe(5000);

    const verify = await paymentService.verify(reference);
    expect(verify.success).toBe(true);

    const done = await paymentModel.findByReference(reference);
    expect(done?.status).toBe("SUCCESS");
    expect(done?.fulfillmentStatus).toBe("COMPLETED");
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  test("amount mismatch marks payment FAILED and creates no tickets", async () => {
    const init = await paymentService.initialize({
      purpose: "TICKET",
      method: "PAYSTACK",
      eventId,
      ticketTypeId,
      quantity: 2,
      email: "flow-mismatch@example.com",
      name: "Flow Tester",
    });

    const reference = init.data.reference as string;

    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 1,
        currency: "NGN",
        gatewayReference: "gw_bad",
      }),
    );

    const verify = await paymentService.verify(reference);

    expect(verify.success).toBe(false);
    expect(verify.status).toBe(400);

    const done = await paymentModel.findByReference(reference);
    expect(done?.status).toBe("FAILED");

    const tickets = await prisma.ticket.findMany({
      where: { paymentTransactionId: done!.id },
    });
    expect(tickets).toHaveLength(0);
  });
});
