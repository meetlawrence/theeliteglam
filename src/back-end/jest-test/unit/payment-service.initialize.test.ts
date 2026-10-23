import { describe, expect, test, jest, beforeEach } from "@jest/globals";

// ---------- Prisma mocks ----------
const mockEventFindUnique = jest.fn(
  (_args: { where: { id: string } }): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockTicketTypeFindUnique = jest.fn(
  (_args: { where: { id: string } }): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

const mockTicketCount = jest.fn(
  (_args: Record<string, unknown>): Promise<number> => Promise.resolve(0)
);

jest.unstable_mockModule("@/back-end/db/db-connect", () => ({
  prisma: {
    event: {
      findUnique: (args: { where: { id: string } }) => mockEventFindUnique(args),
    },
    ticketType: {
      findUnique: (args: { where: { id: string } }) =>
        mockTicketTypeFindUnique(args),
    },
    ticket: {
      count: (args: Record<string, unknown>) => mockTicketCount(args),
    },
  },
}));

// ---------- paymentModel mocks ----------
const mockPaymentCreate = jest.fn(
  (_args: Record<string, unknown>): Promise<Record<string, unknown>> =>
    Promise.resolve({ id: "pay_1", reference: "TIK-ABC" })
);

const mockMarkFailed = jest.fn(
  (_reference: string): Promise<Record<string, unknown>> =>
    Promise.resolve({})
);

const mockUpdateGatewayReference = jest.fn(
  (_reference: string, _gatewayReference: string): Promise<Record<string, unknown>> =>
    Promise.resolve({})
);

jest.unstable_mockModule("@/back-end/models/payment-model", () => ({
  paymentModel: {
    create: (args: Record<string, unknown>) => mockPaymentCreate(args),
    markFailed: (reference: string) => mockMarkFailed(reference),
    updateGatewayReference: (reference: string, gatewayReference: string) =>
      mockUpdateGatewayReference(reference, gatewayReference),
  },
}));

// ---------- gateway mocks ----------
const mockGatewayInitialize = jest.fn(
  (_input: Record<string, unknown>): Promise<{
    success: boolean;
    authorizationUrl?: string;
    accessCode?: string;
    gatewayReference?: string;
    message?: string;
  }> =>
    Promise.resolve({
      success: true,
      authorizationUrl: "https://checkout.paystack.com/xyz",
      accessCode: "access_xyz",
      gatewayReference: "TIK-ABC",
    })
);

jest.unstable_mockModule("@/back-end/services/payment-services/paystack-gateway", () => ({
  paystackGateway: {
    initialize: (input: Record<string, unknown>) => mockGatewayInitialize(input),
    verify: jest.fn(),
  },
}));

jest.unstable_mockModule("@/back-end/services/payment-services/opay-gateway", () => ({
  opayGateway: {
    initialize: jest.fn(),
    verify: jest.fn(),
  },
}));

// Avoid pulling real ticket/contestant side effects
jest.unstable_mockModule("@/back-end/services/ticket-service", () => ({
  ticketService: { fulfill: jest.fn(), resendTicketEmail: jest.fn() },
}));

jest.unstable_mockModule("@/back-end/services/contestant-service", () => ({
  contestantService: {
    sendContestantFormLink: jest.fn(),
    resendContestantFormLink: jest.fn(),
  },
}));

const { paymentService } = await import( "@/back-end/services/payment-services/payment-service");
import type { InitializePaymentInput } from "@/back-end/types/payment-types";

const baseTicket: InitializePaymentInput = {
  purpose: "TICKET",
  method: "PAYSTACK",
  eventId: "event_1",
  ticketTypeId: "tt_1",
  quantity: 2,
  email: "buyer@example.com",
  name: "Buyer",
};

const baseContestant: InitializePaymentInput = {
  purpose: "CONTESTANT",
  method: "PAYSTACK",
  eventId: "event_1",
  email: "c@example.com",
  name: "Contestant",
};

describe("PaymentService.initialize", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 404 when event not found", async () => {
    mockEventFindUnique.mockImplementation(() => Promise.resolve(null));

    const result = await paymentService.initialize(baseTicket);

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
    expect(result.message).toMatch(/event not found/i);
  });

  test("returns 400 when event is CANCELLED", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "CANCELLED",
        contestantFee: 5000,
      })
    );

    const result = await paymentService.initialize(baseContestant);

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/not accepting payments/i);
  });

  test("returns 400 when event is COMPLETED", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "COMPLETED",
        contestantFee: 5000,
      })
    );

    const result = await paymentService.initialize(baseContestant);

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
  });

  test("returns 404 when ticket type not found", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "UPCOMING",
        contestantFee: 5000,
      })
    );
    mockTicketTypeFindUnique.mockImplementation(() => Promise.resolve(null));

    const result = await paymentService.initialize(baseTicket);

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
    expect(result.message).toMatch(/ticket type not found/i);
  });

  test("returns 400 when ticket type belongs to another event", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "UPCOMING",
        contestantFee: 5000,
      })
    );
    mockTicketTypeFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "tt_1",
        eventId: "other_event",
        price: 1000,
        capacity: 100,
      })
    );

    const result = await paymentService.initialize(baseTicket);

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/does not belong/i);
  });

  test("returns 400 when capacity exceeded", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "UPCOMING",
        contestantFee: 5000,
      })
    );
    mockTicketTypeFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "tt_1",
        eventId: "event_1",
        price: 1000,
        capacity: 5,
      })
    );
    mockTicketCount.mockImplementation(() => Promise.resolve(4));

    const result = await paymentService.initialize({
      ...baseTicket,
      quantity: 2, // 4 + 2 > 5
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toMatch(/not enough tickets/i);
  });

  test("creates ticket payment with price * quantity", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "UPCOMING",
        contestantFee: 5000,
      })
    );
    mockTicketTypeFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "tt_1",
        eventId: "event_1",
        price: 1500,
        capacity: 100,
      })
    );
    mockTicketCount.mockImplementation(() => Promise.resolve(0));
    mockPaymentCreate.mockImplementation((args) =>
      Promise.resolve({
        id: "pay_1",
        reference: args.reference,
      })
    );

    const result = await paymentService.initialize(baseTicket);

    expect(result.success).toBe(true);
    expect(result.status).toBe(200);
    expect(mockPaymentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 3000, // 1500 * 2
        purpose: "TICKET",
        email: "buyer@example.com",
      })
    );
    expect(result.data).toEqual(
      expect.objectContaining({
        authorizationUrl: "https://checkout.paystack.com/xyz",
        purpose: "TICKET",
      })
    );
  });

  test("creates contestant payment with contestantFee", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "ONGOING",
        contestantFee: 7500,
      })
    );
    mockPaymentCreate.mockImplementation((args) =>
      Promise.resolve({
        id: "pay_2",
        reference: args.reference,
      })
    );

    const result = await paymentService.initialize(baseContestant);

    expect(result.success).toBe(true);
    expect(mockPaymentCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 7500,
        purpose: "CONTESTANT",
        ticketTypeId: null,
        quantity: null,
      })
    );
  });

  test("marks failed and returns 502 when gateway init fails", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "UPCOMING",
        contestantFee: 5000,
      })
    );
    mockPaymentCreate.mockImplementation((args) =>
      Promise.resolve({
        id: "pay_3",
        reference: args.reference,
      })
    );
    mockGatewayInitialize.mockImplementation(() =>
      Promise.resolve({
        success: false,
        message: "Paystack down",
      })
    );

    const result = await paymentService.initialize(baseContestant);

    expect(result.success).toBe(false);
    expect(result.status).toBe(502);
    expect(mockMarkFailed).toHaveBeenCalledTimes(1);
  });

  test("stores gatewayReference when provided", async () => {
    mockEventFindUnique.mockImplementation(() =>
      Promise.resolve({
        id: "event_1",
        status: "UPCOMING",
        contestantFee: 5000,
      })
    );
    mockPaymentCreate.mockImplementation((args) =>
      Promise.resolve({
        id: "pay_4",
        reference: args.reference,
      })
    );
    mockGatewayInitialize.mockImplementation(() =>
      Promise.resolve({
        success: true,
        authorizationUrl: "https://checkout.paystack.com/xyz",
        accessCode: "access_xyz",
        gatewayReference: "gw_ref_1",
      })
    );

    const result = await paymentService.initialize(baseContestant);

    expect(result.success).toBe(true);
    expect(mockUpdateGatewayReference).toHaveBeenCalledWith(
      expect.any(String),
      "gw_ref_1"
    );
  });
});