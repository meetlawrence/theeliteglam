import { describe, expect, test, jest, beforeEach } from "@jest/globals";

const mockFindByReference = jest.fn(
  (_reference: string): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockResetFulfillmentForRetry = jest.fn(
  (_reference: string): Promise<boolean> => Promise.resolve(true)
);

const mockClaimForFulfillment = jest.fn(
  (_reference: string): Promise<boolean> => Promise.resolve(true)
);

const mockMarkFulfilled = jest.fn(
  (_reference: string): Promise<Record<string, unknown>> => Promise.resolve({})
);

const mockMarkFulfillmentFailed = jest.fn(
  (_reference: string): Promise<Record<string, unknown>> => Promise.resolve({})
);

jest.unstable_mockModule("@/back-end/models/payment-model", () => ({
  paymentModel: {
    findByReference: (reference: string) => mockFindByReference(reference),
    resetFulfillmentForRetry: (reference: string) =>
      mockResetFulfillmentForRetry(reference),
    claimForFulfillment: (reference: string) => mockClaimForFulfillment(reference),
    markFulfilled: (reference: string) => mockMarkFulfilled(reference),
    markFulfillmentFailed: (reference: string) =>
      mockMarkFulfillmentFailed(reference),
  },
}));

const mockResendTicketEmail = jest.fn(
  (_reference: string): Promise<{
    success: boolean;
    message?: string;
    status?: number;
  }> =>
    Promise.resolve({ success: true, message: "resent", status: 200 })
);

const mockTicketFulfill = jest.fn(
  (_tx: Record<string, unknown>): Promise<{
    success: boolean;
    message?: string;
    status?: number;
    data?: unknown;
  }> =>
    Promise.resolve({ success: true, status: 200, data: [] })
);

jest.unstable_mockModule("@/back-end/services/ticket-service", () => ({
  ticketService: {
    resendTicketEmail: (reference: string) => mockResendTicketEmail(reference),
    fulfill: (tx: Record<string, unknown>) => mockTicketFulfill(tx),
  },
}));

const mockResendContestantFormLink = jest.fn(
  (_reference: string): Promise<{
    success: boolean;
    message?: string;
    status?: number;
  }> =>
    Promise.resolve({ success: true, message: "resent", status: 200 })
);

jest.unstable_mockModule("@/back-end/services/contestant-service", () => ({
  contestantService: {
    resendContestantFormLink: (reference: string) =>
      mockResendContestantFormLink(reference),
    sendContestantFormLink: jest.fn(),
  },
}));

jest.unstable_mockModule("@/back-end/services/payment-services/paystack-gateway", () => ({
  paystackGateway: { initialize: jest.fn(), verify: jest.fn() },
}));

jest.unstable_mockModule("@/back-end/services/payment-services/opay-gateway", () => ({
  opayGateway: { initialize: jest.fn(), verify: jest.fn() },
}));

jest.unstable_mockModule("@/back-end/db/db-connect", () => ({
  prisma: {},
}));

const { paymentService } = await import("@/back-end/services/payment-services/payment-service");

function makeTx(overrides: Record<string, unknown> = {}) {
  return {
    id: "pay_1",
    reference: "TIK-ABC123456789",
    purpose: "TICKET",
    gateway: "PAYSTACK",
    amount: 5000,
    status: "SUCCESS",
    fulfillmentStatus: "FAILED",
    email: "buyer@example.com",
    eventId: "event_1",
    ticketTypeId: "tt_1",
    quantity: 2,
    tickets: [],
    ...overrides,
  };
}

describe("PaymentService.retryFulfillment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 404 when payment not found", async () => {
    mockFindByReference.mockImplementation(() => Promise.resolve(null));

    const result = await paymentService.retryFulfillment("MISSING-REF-123456");

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  test("returns 400 when payment is not SUCCESS", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(makeTx({ status: "PENDING" }))
    );

    const result = await paymentService.retryFulfillment("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/successful payments/i);
  });

  test("TICKET with existing tickets only resends email", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          tickets: [{ id: "t1" }, { id: "t2" }],
          fulfillmentStatus: "COMPLETED",
        })
      )
    );
    mockResendTicketEmail.mockImplementation(() =>
      Promise.resolve({ success: true, status: 200, message: "resent" })
    );

    const result = await paymentService.retryFulfillment("TIK-ABC123456789");

    expect(result.success).toBe(true);
    expect(mockResendTicketEmail).toHaveBeenCalledWith("TIK-ABC123456789");
    expect(mockTicketFulfill).not.toHaveBeenCalled();
    expect(mockClaimForFulfillment).not.toHaveBeenCalled();
  });

  test("TICKET with existing tickets marks fulfilled if not completed", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          tickets: [{ id: "t1" }],
          fulfillmentStatus: "FAILED",
        })
      )
    );
    mockResendTicketEmail.mockImplementation(() =>
      Promise.resolve({ success: true, status: 200 })
    );

    const result = await paymentService.retryFulfillment("TIK-ABC123456789");

    expect(result.success).toBe(true);
    expect(mockMarkFulfilled).toHaveBeenCalledWith("TIK-ABC123456789");
  });

  test("TICKET with no tickets resets FAILED then claims and fulfills", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          tickets: [],
          fulfillmentStatus: "FAILED",
        })
      )
    );
    mockResetFulfillmentForRetry.mockImplementation(() => Promise.resolve(true));
    mockClaimForFulfillment.mockImplementation(() => Promise.resolve(true));
    mockTicketFulfill.mockImplementation(() =>
      Promise.resolve({ success: true, status: 200, data: [{ id: "t1" }] })
    );

    const result = await paymentService.retryFulfillment("TIK-ABC123456789");

    expect(result.success).toBe(true);
    expect(mockResetFulfillmentForRetry).toHaveBeenCalledWith("TIK-ABC123456789");
    expect(mockClaimForFulfillment).toHaveBeenCalledWith("TIK-ABC123456789");
    expect(mockTicketFulfill).toHaveBeenCalledTimes(1);
    expect(mockMarkFulfilled).toHaveBeenCalledWith("TIK-ABC123456789");
    expect(mockResendTicketEmail).not.toHaveBeenCalled();
  });

  test("TICKET returns 409 when reset fails", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          tickets: [],
          fulfillmentStatus: "FAILED",
        })
      )
    );
    mockResetFulfillmentForRetry.mockImplementation(() => Promise.resolve(false));

    const result = await paymentService.retryFulfillment("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(409);
  });

  test("TICKET returns 409 when claim loses", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          tickets: [],
          fulfillmentStatus: "FAILED",
        })
      )
    );
    mockResetFulfillmentForRetry.mockImplementation(() => Promise.resolve(true));
    mockClaimForFulfillment.mockImplementation(() => Promise.resolve(false));

    const result = await paymentService.retryFulfillment("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(409);
    expect(mockTicketFulfill).not.toHaveBeenCalled();
  });

  test("TICKET marks fulfillment failed when fulfill fails", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          tickets: [],
          fulfillmentStatus: "FAILED",
        })
      )
    );
    mockResetFulfillmentForRetry.mockImplementation(() => Promise.resolve(true));
    mockClaimForFulfillment.mockImplementation(() => Promise.resolve(true));
    mockTicketFulfill.mockImplementation(() =>
      Promise.resolve({ success: false, message: "capacity", status: 409 })
    );

    const result = await paymentService.retryFulfillment("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(mockMarkFulfillmentFailed).toHaveBeenCalledWith("TIK-ABC123456789");
  });

  test("CONTESTANT uses resend form link", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          purpose: "CONTESTANT",
          reference: "CON-ABC123456789",
          tickets: undefined,
          fulfillmentStatus: "FAILED",
        })
      )
    );
    mockResendContestantFormLink.mockImplementation(() =>
      Promise.resolve({ success: true, status: 200 })
    );

    const result = await paymentService.retryFulfillment("CON-ABC123456789");

    expect(result.success).toBe(true);
    expect(mockResendContestantFormLink).toHaveBeenCalledWith("CON-ABC123456789");
    expect(mockTicketFulfill).not.toHaveBeenCalled();
  });
});