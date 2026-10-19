import { describe, expect, test, jest, beforeEach } from "@jest/globals";

const mockFindByPaymentTransactionId = jest.fn(
  (_id: string): Promise<Record<string, unknown>[]> => Promise.resolve([])
);

const mockUpdateStatusByPaymentTransactionId = jest.fn(
  (_id: string, _status: string): Promise<Record<string, unknown>> =>
    Promise.resolve({})
);

const mockFindById = jest.fn(
  (_id: string): Promise<Record<string, unknown> | null> => Promise.resolve(null)
);

const mockMarkAsUsed = jest.fn(
  (_id: string): Promise<Record<string, unknown>> => Promise.resolve({})
);

const mockTicketTypeFindUnique = jest.fn(
  (_args: { where: { id: string } }): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockTicketCount = jest.fn(
  (_args: Record<string, unknown>): Promise<number> => Promise.resolve(0)
);

const mockCreateManyAndReturn = jest.fn(
  (_args: { data: Record<string, unknown>[] }): Promise<Record<string, unknown>[]> =>
    Promise.resolve([])
);

const mockPaymentFindUnique = jest.fn(
  (_args: Record<string, unknown>): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockIdempotencyFindUnique = jest.fn(
  (_args: Record<string, unknown>): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockIdempotencyUpsert = jest.fn(
  (_args: Record<string, unknown>): Promise<Record<string, unknown>> =>
    Promise.resolve({})
);

const mockSendEmail = jest.fn(
  (_to: string, _payload: Record<string, unknown>): Promise<{ success: boolean }> =>
    Promise.resolve({ success: true })
);

const mockToDataURL = jest.fn(
  (): Promise<string> => Promise.resolve("data:image/png;base64,AAA")
);

const mockUploadQRCode = jest.fn(
  (_base64: string): Promise<string> =>
    Promise.resolve("https://cdn.example.com/qr.png")
);

jest.unstable_mockModule("@/back-end/models/ticket-model", () => ({
  ticketModel: {
    findByPaymentTransactionId: (id: string) =>
      mockFindByPaymentTransactionId(id),
    updateStatusByPaymentTransactionId: (id: string, status: string) =>
      mockUpdateStatusByPaymentTransactionId(id, status),
    findById: (id: string) => mockFindById(id),
    markAsUsed: (id: string) => mockMarkAsUsed(id),
  },
}));

jest.unstable_mockModule("@/back-end/database/db-connect", () => ({
  prisma: {
    ticketType: {
      findUnique: (args: { where: { id: string } }) =>
        mockTicketTypeFindUnique(args),
    },
    ticket: {
      count: (args: Record<string, unknown>) => mockTicketCount(args),
    },
    paymentTransaction: {
      findUnique: (args: Record<string, unknown>) => mockPaymentFindUnique(args),
    },
    idempotencyKey: {
      findUnique: (args: Record<string, unknown>) =>
        mockIdempotencyFindUnique(args),
      upsert: (args: Record<string, unknown>) => mockIdempotencyUpsert(args),
    },
    $transaction: async (
      fn: (tx: Record<string, unknown>) => Promise<unknown>
    ) => {
      const tx = {
        ticketType: {
          findUnique: (args: { where: { id: string } }) =>
            mockTicketTypeFindUnique(args),
        },
        ticket: {
          count: (args: Record<string, unknown>) => mockTicketCount(args),
          createManyAndReturn: (args: { data: Record<string, unknown>[] }) =>
            mockCreateManyAndReturn(args),
        },
      };
      return fn(tx);
    },
    $disconnect: () => Promise.resolve(),
  },
}));

jest.unstable_mockModule("@/back-end/lib/email/resend", () => ({
  sendEmail: (to: string, payload: Record<string, unknown>) =>
    mockSendEmail(to, payload),
}));

jest.unstable_mockModule("qrcode", () => ({
  default: {
    toDataURL: () => mockToDataURL(),
  },
}));

jest.unstable_mockModule("@/back-end/database/cloudinary", () => ({
  uploadQRCode: (base64: string) => mockUploadQRCode(base64),
}));

jest.unstable_mockModule("@/back-end/lib/utils/jwt", () => ({
  verifyTicketToken: jest.fn(),
}));

const { ticketService } = await import("@/back-end/services/ticket-service");

import type { PaymentTransaction } from "@/back-end/types/payment-types";

function makePayment(
  overrides: Partial<PaymentTransaction> & Record<string, unknown> = {}
): PaymentTransaction {
  return {
    id: "pay_1",
    reference: "TIK-ABC123456789",
    purpose: "TICKET",
    gateway: "PAYSTACK",
    gatewayReference: null,
    amount: 3000 as never,
    currency: "NGN",
    status: "SUCCESS",
    fulfillmentStatus: "PROCESSING",
    email: "buyer@example.com",
    phoneNumber: null,
    name: "Buyer",
    eventId: "event_1",
    ticketTypeId: "tt_1",
    quantity: 2,
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as PaymentTransaction;
}

describe("TicketService.fulfill", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockFindByPaymentTransactionId.mockImplementation(() => Promise.resolve([]));
    mockTicketTypeFindUnique.mockImplementation(() => Promise.resolve(null));
    mockTicketCount.mockImplementation(() => Promise.resolve(0));
    mockCreateManyAndReturn.mockImplementation(() => Promise.resolve([]));
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: true }));
    mockToDataURL.mockImplementation(() =>
      Promise.resolve("data:image/png;base64,AAA")
    );
    mockUploadQRCode.mockImplementation(() =>
      Promise.resolve("https://cdn.example.com/qr.png")
    );
  });

  test("returns 400 when ticketTypeId or quantity missing", async () => {
    const result = await ticketService.fulfill(
      makePayment({ ticketTypeId: null, quantity: null })
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  test("creates tickets when none exist and sends email", async () => {
    mockTicketTypeFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "tt_1",
        eventId: "event_1",
        capacity: 100,
        price: 1500,
      })
    );
    mockCreateManyAndReturn.mockImplementation(({ data }) =>
      Promise.resolve(data.map((d, i) => ({ id: `t${i + 1}`, ...d })))
    );

    const result = await ticketService.fulfill(makePayment());

    expect(result.success).toBe(true);
    expect(mockCreateManyAndReturn).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockUpdateStatusByPaymentTransactionId).toHaveBeenCalledWith(
      "pay_1",
      "SENT"
    );
  });

  test("does not create tickets when they already exist and are SENT", async () => {
    mockFindByPaymentTransactionId.mockImplementation(() =>
      Promise.resolve([
        {
          id: "t1",
          ticket: "TIK-111",
          status: "SENT",
          paymentTransactionId: "pay_1",
        },
        {
          id: "t2",
          ticket: "TIK-222",
          status: "SENT",
          paymentTransactionId: "pay_1",
        },
      ])
    );

    const result = await ticketService.fulfill(makePayment());

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/already issued/i);
    expect(mockCreateManyAndReturn).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  test("returns 409 when capacity exceeded", async () => {
    mockTicketTypeFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "tt_1",
        eventId: "event_1",
        capacity: 5,
      })
    );
    mockTicketCount.mockImplementation(() => Promise.resolve(4));

    const result = await ticketService.fulfill(makePayment({ quantity: 2 }));

    expect(result.success).toBe(false);
    expect(result.status).toBe(409);
    expect(result.message).toMatch(/not enough tickets/i);
  });

  test("returns 400 when ticket type event mismatch", async () => {
    mockTicketTypeFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "tt_1",
        eventId: "other_event",
        capacity: 100,
      })
    );

    const result = await ticketService.fulfill(makePayment());

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/does not belong/i);
  });

  test("returns 500 when email fails after ticket create", async () => {
    mockTicketTypeFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "tt_1",
        eventId: "event_1",
        capacity: 100,
      })
    );
    mockCreateManyAndReturn.mockImplementation(({ data }) =>
      Promise.resolve(data.map((d, i) => ({ id: `t${i + 1}`, ...d })))
    );
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: false }));

    const result = await ticketService.fulfill(makePayment());

    expect(result.success).toBe(false);
    expect(result.status).toBe(500);
    expect(result.message).toMatch(/email failed/i);
  });
});

describe("TicketService.resendTicketEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPaymentFindUnique.mockImplementation(() => Promise.resolve(null));
    mockIdempotencyFindUnique.mockImplementation(() => Promise.resolve(null));
    mockSendEmail.mockImplementation(() => Promise.resolve({ success: true }));
  });

  test("returns 404 when payment not found", async () => {
    const result = await ticketService.resendTicketEmail("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  test("returns 400 when purpose is not TICKET", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve({
        reference: "CON-ABC123456789",
        purpose: "CONTESTANT",
        status: "SUCCESS",
        tickets: [],
      })
    );

    const result = await ticketService.resendTicketEmail("CON-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  test("returns 400 when payment not SUCCESS", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve({
        reference: "TIK-ABC123456789",
        purpose: "TICKET",
        status: "PENDING",
        tickets: [{ id: "t1", ticket: "TIK-1" }],
      })
    );

    const result = await ticketService.resendTicketEmail("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  test("returns 404 when no tickets", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "pay_1",
        reference: "TIK-ABC123456789",
        purpose: "TICKET",
        status: "SUCCESS",
        email: "buyer@example.com",
        name: "Buyer",
        amount: 3000,
        tickets: [],
      })
    );

    const result = await ticketService.resendTicketEmail("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  test("returns 429 when rate limited", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "pay_1",
        reference: "TIK-ABC123456789",
        purpose: "TICKET",
        status: "SUCCESS",
        email: "buyer@example.com",
        name: "Buyer",
        amount: 3000,
        tickets: [{ id: "t1", ticket: "TIK-1" }],
      })
    );
    mockIdempotencyFindUnique.mockImplementation(() =>
      Promise.resolve({
        key: "resend-ticket:TIK-ABC123456789",
        createdAt: new Date(),
      })
    );

    const result = await ticketService.resendTicketEmail("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(429);
  });

  test("resends email and upserts rate limit on success", async () => {
    mockPaymentFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "pay_1",
        reference: "TIK-ABC123456789",
        purpose: "TICKET",
        status: "SUCCESS",
        email: "buyer@example.com",
        name: "Buyer",
        amount: 3000,
        tickets: [{ id: "t1", ticket: "TIK-1" }],
      })
    );

    const result = await ticketService.resendTicketEmail("TIK-ABC123456789");

    expect(result.success).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockUpdateStatusByPaymentTransactionId).toHaveBeenCalledWith(
      "pay_1",
      "SENT"
    );
    expect(mockIdempotencyUpsert).toHaveBeenCalledTimes(1);
  });
});