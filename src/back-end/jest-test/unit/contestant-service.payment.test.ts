import { describe, expect, test, jest, beforeEach } from "@jest/globals";

const mockPaymentFindUnique = jest.fn(
  (_args: { where: { reference: string } }): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockIdempotencyFindUnique = jest.fn(
  (_args: { where: { key: string } }): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockIdempotencyUpsert = jest.fn(
  (_args: Record<string, unknown>): Promise<Record<string, unknown>> =>
    Promise.resolve({})
);

jest.unstable_mockModule("@/back-end/database/db-connect", () => ({
  prisma: {
    paymentTransaction: {
      findUnique: (args: { where: { reference: string } }) =>
        mockPaymentFindUnique(args),
    },
    idempotencyKey: {
      findUnique: (args: { where: { key: string } }) =>
        mockIdempotencyFindUnique(args),
      upsert: (args: Record<string, unknown>) => mockIdempotencyUpsert(args),
    },
  },
}));

const mockSendEmail = jest.fn(
  (_to: string, _payload: Record<string, unknown>): Promise<{ success: boolean }> =>
    Promise.resolve({ success: true })
);

jest.unstable_mockModule("@/back-end/lib/email/resend", () => ({
  sendEmail: (to: string, payload: Record<string, unknown>) =>
    mockSendEmail(to, payload),
}));

// Other contestant deps that may load with the module
jest.unstable_mockModule("@/back-end/models/contestant-model", () => ({
  contestantModel: {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByReference: jest.fn(),
    findAll: jest.fn(),
    findByEventId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.unstable_mockModule("@/back-end/models/payment-model", () => ({
  paymentModel: {
    markFulfilled: jest.fn(),
  },
}));

const { contestantService } = await import("@/back-end/services/contestant-service");

function makePayment(overrides: Record<string, unknown> = {}) {
  return {
    id: "pay_1",
    reference: "CON-ABC123456789",
    purpose: "CONTESTANT",
    status: "SUCCESS",
    email: "c@example.com",
    name: "Jane Doe",
    fulfillmentStatus: "PROCESSING",
    ...overrides,
  };
}

describe("ContestantService.sendContestantFormLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  test("returns 404 when payment not found", async () => {
    mockPaymentFindUnique.mockImplementation(() => Promise.resolve(null));

    const result = await contestantService.sendContestantFormLink(
      "CON-MISSING123456"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  test("returns 400 when purpose is not CONTESTANT", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment({ purpose: "TICKET" }))
    );

    const result = await contestantService.sendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/not for a contestant/i);
  });

  test("returns 400 when payment not SUCCESS", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment({ status: "PENDING" }))
    );

    const result = await contestantService.sendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/not been completed/i);
  });

  test("returns 500 when email fails", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment())
    );
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: false }));

    const result = await contestantService.sendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(500);
  });

  test("sends form link email on success", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment())
    );
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: true }));

    const result = await contestantService.sendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(mockSendEmail).toHaveBeenCalledWith(
      "c@example.com",
      expect.objectContaining({
        type: "contestant-form",
        props: expect.objectContaining({
          formLink:
            "http://localhost:3000/contestant/form?reference=CON-ABC123456789",
          reference: "CON-ABC123456789",
        }),
      })
    );
  });
});

describe("ContestantService.resendContestantFormLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  test("returns 404 when payment not found", async () => {
    mockPaymentFindUnique.mockImplementation(() => Promise.resolve(null));

    const result = await contestantService.resendContestantFormLink(
      "CON-MISSING123456"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  test("returns 400 when purpose is not CONTESTANT", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment({ purpose: "TICKET" }))
    );

    const result = await contestantService.resendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  test("returns 400 when payment not SUCCESS", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment({ status: "PENDING" }))
    );

    const result = await contestantService.resendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  test("returns 429 when rate limited", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment())
    );
    mockIdempotencyFindUnique.mockImplementation(() =>
      Promise.resolve({
        key: "resend-form:CON-ABC123456789",
        createdAt: new Date(), // within window
      })
    );

    const result = await contestantService.resendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(429);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  test("resends email and upserts rate limit on success", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment())
    );
    mockIdempotencyFindUnique.mockImplementation(() => Promise.resolve(null));
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: true }));
    mockIdempotencyUpsert.mockImplementation(() => Promise.resolve({}));

    const result = await contestantService.resendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockIdempotencyUpsert).toHaveBeenCalledTimes(1);
  });

  test("returns 500 when email fails", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve(makePayment())
    );
    mockIdempotencyFindUnique.mockImplementation(() => Promise.resolve(null));
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: false }));

    const result = await contestantService.resendContestantFormLink(
      "CON-ABC123456789"
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(500);
    expect(mockIdempotencyUpsert).not.toHaveBeenCalled();
  });
});