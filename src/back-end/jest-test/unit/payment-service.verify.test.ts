import { describe, expect, test, jest, beforeEach } from "@jest/globals";

// ---------- paymentModel ----------
const mockFindByReference = jest.fn(
  (_reference: string): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockMarkSuccess = jest.fn(
  (_reference: string, _gatewayReference?: string | null): Promise<Record<string, unknown>> =>
    Promise.resolve({})
);

const mockMarkFailed = jest.fn(
  (_reference: string): Promise<Record<string, unknown>> => Promise.resolve({})
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
    markSuccess: (reference: string, gatewayReference?: string | null) =>
      mockMarkSuccess(reference, gatewayReference),
    markFailed: (reference: string) => mockMarkFailed(reference),
    claimForFulfillment: (reference: string) => mockClaimForFulfillment(reference),
    markFulfilled: (reference: string) => mockMarkFulfilled(reference),
    markFulfillmentFailed: (reference: string) =>
      mockMarkFulfillmentFailed(reference),
  },
}));

// ---------- gateway ----------
const mockGatewayVerify = jest.fn(
  (_reference: string): Promise<{
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
      amount: 5000,
      currency: "NGN",
      gatewayReference: "gw_1",
    })
);

jest.unstable_mockModule("@/back-end/services/payment-services/paystack-gateway", () => ({
  paystackGateway: {
    initialize: jest.fn(),
    verify: (reference: string) => mockGatewayVerify(reference),
  },
}));

jest.unstable_mockModule("@/back-end/services/payment-services/opay-gateway", () => ({
  opayGateway: {
    initialize: jest.fn(),
    verify: jest.fn(),
  },
}));

// ---------- fulfillment services ----------
const mockTicketFulfill = jest.fn(
  (_tx: Record<string, unknown>): Promise<{
    success: boolean;
    message?: string;
    status?: number;
    data?: unknown;
  }> =>
    Promise.resolve({
      success: true,
      message: "ok",
      status: 200,
      data: [{ id: "t1" }],
    })
);

const mockSendContestantFormLink = jest.fn(
  (_reference: string): Promise<{
    success: boolean;
    message?: string;
    status?: number;
  }> =>
    Promise.resolve({
      success: true,
      message: "sent",
      status: 200,
    })
);

jest.unstable_mockModule("@/back-end/services/ticket-service", () => ({
  ticketService: {
    fulfill: (tx: Record<string, unknown>) => mockTicketFulfill(tx),
    resendTicketEmail: jest.fn(),
  },
}));

jest.unstable_mockModule("@/back-end/services/contestant-service", () => ({
  contestantService: {
    sendContestantFormLink: (reference: string) =>
      mockSendContestantFormLink(reference),
    resendContestantFormLink: jest.fn(),
  },
}));

// prisma is imported in payment-service; provide a minimal mock
jest.unstable_mockModule("@/back-end/database/db-connect", () => ({
  prisma: {},
}));

const { paymentService } = await import( "@/back-end/services/payment-services/payment-service");

function makeTx(overrides: Record<string, unknown> = {}) {
  return {
    id: "pay_1",
    reference: "TIK-ABC123456789",
    purpose: "TICKET",
    gateway: "PAYSTACK",
    amount: 5000,
    currency: "NGN",
    status: "PENDING",
    fulfillmentStatus: "PENDING",
    email: "buyer@example.com",
    eventId: "event_1",
    ticketTypeId: "tt_1",
    quantity: 2,
    ...overrides,
  };
}

describe("PaymentService.verify", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 404 when payment not found", async () => {
    mockFindByReference.mockImplementation(() => Promise.resolve(null));

    const result = await paymentService.verify("MISSING-REF-123456");

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
  });

  test("returns idempotent success when already completed", async () => {
    const tx = makeTx({
      status: "SUCCESS",
      fulfillmentStatus: "COMPLETED",
    });
    mockFindByReference.mockImplementation(() => Promise.resolve(tx));

    const result = await paymentService.verify(tx.reference as string);

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/already verified/i);
    expect(mockGatewayVerify).not.toHaveBeenCalled();
    expect(mockTicketFulfill).not.toHaveBeenCalled();
  });

  test("returns 400 when gateway payment not successful", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(makeTx())
    );
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: false,
        status: "FAILED",
        amount: 0,
        message: "Not paid",
      })
    );

    const result = await paymentService.verify("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(mockMarkFailed).toHaveBeenCalled();
  });

  test("marks failed on amount mismatch", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(makeTx({ amount: 5000 }))
    );
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 1000, // mismatch
        currency: "NGN",
      })
    );

    const result = await paymentService.verify("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/amount/i);
    expect(mockMarkFailed).toHaveBeenCalled();
  });

  test("marks failed on unexpected currency", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(makeTx({ amount: 5000 }))
    );
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 5000,
        currency: "USD",
      })
    );

    const result = await paymentService.verify("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/currency/i);
    expect(mockMarkFailed).toHaveBeenCalled();
  });

  test("does not fulfill when claim loses race", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(makeTx({ amount: 5000 }))
    );
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 5000,
        currency: "NGN",
        gatewayReference: "gw_1",
      })
    );
    mockClaimForFulfillment.mockImplementation(() => Promise.resolve(false));

    const result = await paymentService.verify("TIK-ABC123456789");

    expect(result.success).toBe(true);
    expect(result.message).toMatch(/already being processed|completed/i);
    expect(mockTicketFulfill).not.toHaveBeenCalled();
    expect(mockSendContestantFormLink).not.toHaveBeenCalled();
  });

  test("TICKET: fulfills and marks completed when claim wins", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(makeTx({ amount: 5000, purpose: "TICKET" }))
    );
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 5000,
        currency: "NGN",
        gatewayReference: "gw_1",
      })
    );
    mockClaimForFulfillment.mockImplementation(() => Promise.resolve(true));
    mockTicketFulfill.mockImplementation(() =>
      Promise.resolve({
        success: true,
        data: [{ id: "t1" }, { id: "t2" }],
        status: 200,
      })
    );

    const result = await paymentService.verify("TIK-ABC123456789");

    expect(result.success).toBe(true);
    expect(mockMarkSuccess).toHaveBeenCalled();
    expect(mockTicketFulfill).toHaveBeenCalledTimes(1);
    expect(mockMarkFulfilled).toHaveBeenCalledWith("TIK-ABC123456789");
  });

  test("TICKET: marks fulfillment failed when fulfill fails", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(makeTx({ amount: 5000, purpose: "TICKET" }))
    );
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 5000,
        currency: "NGN",
      })
    );
    mockClaimForFulfillment.mockImplementation(() => Promise.resolve(true));
    mockTicketFulfill.mockImplementation(() =>
      Promise.resolve({
        success: false,
        message: "Email failed",
        status: 500,
      })
    );

    const result = await paymentService.verify("TIK-ABC123456789");

    expect(result.success).toBe(false);
    expect(mockMarkFulfillmentFailed).toHaveBeenCalledWith("TIK-ABC123456789");
    expect(mockMarkFulfilled).not.toHaveBeenCalled();
  });

  test("CONTESTANT: sends form link and marks completed when claim wins", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          amount: 5000,
          purpose: "CONTESTANT",
          reference: "CON-ABC123456789",
          ticketTypeId: null,
          quantity: null,
        })
      )
    );
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 5000,
        currency: "NGN",
      })
    );
    mockClaimForFulfillment.mockImplementation(() => Promise.resolve(true));
    mockSendContestantFormLink.mockImplementation(() =>
      Promise.resolve({ success: true, status: 200 })
    );

    const result = await paymentService.verify("CON-ABC123456789");

    expect(result.success).toBe(true);
    expect(mockSendContestantFormLink).toHaveBeenCalledWith("CON-ABC123456789");
    expect(mockMarkFulfilled).toHaveBeenCalledWith("CON-ABC123456789");
    expect(mockTicketFulfill).not.toHaveBeenCalled();
  });

  test("CONTESTANT: marks fulfillment failed when email fails", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve(
        makeTx({
          amount: 5000,
          purpose: "CONTESTANT",
          reference: "CON-ABC123456789",
        })
      )
    );
    mockGatewayVerify.mockImplementation(() =>
      Promise.resolve({
        success: true,
        status: "SUCCESS",
        amount: 5000,
        currency: "NGN",
      })
    );
    mockClaimForFulfillment.mockImplementation(() => Promise.resolve(true));
    mockSendContestantFormLink.mockImplementation(() =>
      Promise.resolve({
        success: false,
        message: "Failed to send form link email",
        status: 500,
      })
    );

    const result = await paymentService.verify("CON-ABC123456789");

    expect(result.success).toBe(false);
    expect(mockMarkFulfillmentFailed).toHaveBeenCalled();
    expect(mockMarkFulfilled).not.toHaveBeenCalled();
  });
});