import { describe, expect, test, jest, beforeEach } from "@jest/globals";
import { NextRequest } from "next/server";

// ---------- service mocks ----------
const mockInitialize = jest.fn(
  (_body: Record<string, unknown>): Promise<{
    success: boolean;
    message: string;
    status: number;
    data?: Record<string, unknown>;
  }> =>
    Promise.resolve({
      success: true,
      message: "ok",
      status: 200,
      data: { reference: "CON-ABC123456789" },
    })
);

const mockVerify = jest.fn(
  (_reference: string): Promise<{
    success: boolean;
    message: string;
    status: number;
  }> =>
    Promise.resolve({
      success: true,
      message: "verified",
      status: 200,
    })
);

jest.unstable_mockModule("@/back-end/services/payment-services/payment-service", () => ({
  paymentService: {
    initialize: (body: Record<string, unknown>) => mockInitialize(body),
    verify: (reference: string) => mockVerify(reference),
    listFailedFulfillments: jest.fn(),
    retryFulfillment: jest.fn(),
  },
}));

// ---------- idempotency mocks ----------
const mockValidateIdempotencyKey = jest.fn(
  (key: string | null): string | null => key
);

const mockClaimIdempotencyKey = jest.fn(
  (_params: Record<string, unknown>): Promise<{ claimed: boolean }> =>
    Promise.resolve({ claimed: true })
);

const mockGetIdempotentResponse = jest.fn(
  (_key: string): Promise<{
    pending: boolean;
    statusCode?: number;
    response?: unknown;
  } | null> => Promise.resolve(null)
);

const mockCompleteIdempotentResponse = jest.fn(
  (_params: Record<string, unknown>): Promise<void> => Promise.resolve()
);

jest.unstable_mockModule("@/back-end/lib/utils/idempotency", () => ({
  validateIdempotencyKey: (key: string | null) => mockValidateIdempotencyKey(key),
  claimIdempotencyKey: (params: Record<string, unknown>) =>
    mockClaimIdempotencyKey(params),
  getIdempotentResponse: (key: string) => mockGetIdempotentResponse(key),
  completeIdempotentResponse: (params: Record<string, unknown>) =>
    mockCompleteIdempotentResponse(params),
}));

// ---------- payment model (resend route) ----------
const mockFindByReference = jest.fn(
  (_reference: string): Promise<Record<string, unknown> | null> =>
    Promise.resolve(null)
);

jest.unstable_mockModule("@/back-end/models/payment-model", () => ({
  paymentModel: {
    findByReference: (reference: string) => mockFindByReference(reference),
  },
}));

const mockResendTicketEmail = jest.fn(
  (_reference: string): Promise<{ success: boolean; status: number; message: string }> =>
    Promise.resolve({ success: true, status: 200, message: "resent" })
);

const mockResendContestantFormLink = jest.fn(
  (_reference: string): Promise<{ success: boolean; status: number; message: string }> =>
    Promise.resolve({ success: true, status: 200, message: "resent" })
);

jest.unstable_mockModule("@/back-end/services/ticket-service", () => ({
  ticketService: {
    resendTicketEmail: (reference: string) => mockResendTicketEmail(reference),
  },
}));

jest.unstable_mockModule("@/back-end/services/contestant-service", () => ({
  contestantService: {
    resendContestantFormLink: (reference: string) =>
      mockResendContestantFormLink(reference),
  },
}));

const initialize = await import("@/app/api/payment/initialize/route");
const initializePOST = initialize.POST;

const verify = await import("@/app/api/payment/verify/route");
const verifyPOST = verify.POST;
const resend = await import("@/app/api/payment/resend-email/route");
const resendPOST = resend.POST

function jsonRequest(
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/payments/initialize", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateIdempotencyKey.mockImplementation((key) => key);
    mockClaimIdempotencyKey.mockImplementation(() =>
      Promise.resolve({ claimed: true })
    );
  });

  test("returns 400 when Idempotency-Key missing", async () => {
    mockValidateIdempotencyKey.mockImplementation(() => null);

    const req = jsonRequest("http://localhost/api/payments/initialize", {
      purpose: "CONTESTANT",
      method: "PAYSTACK",
      eventId: "event_1",
      email: "a@b.com",
      name: "Jane Doe",
    });

    const res = await initializePOST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.message).toMatch(/Idempotency-Key/i);
    expect(mockInitialize).not.toHaveBeenCalled();
  });

  test("returns 400 when body is invalid", async () => {
    const req = jsonRequest(
      "http://localhost/api/payments/initialize",
      { purpose: "TICKET" }, // missing fields
      { "Idempotency-Key": "valid-key-12345" }
    );

    const res = await initializePOST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(mockInitialize).not.toHaveBeenCalled();
  });

  test("processes when key claimed", async () => {
    const body = {
      purpose: "CONTESTANT",
      method: "PAYSTACK",
      eventId: "event_1",
      email: "a@b.com",
      name: "Jane Doe",
    };

    const req = jsonRequest(
      "http://localhost/api/payments/initialize",
      body,
      { "Idempotency-Key": "valid-key-12345" }
    );

    const res = await initializePOST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(mockInitialize).toHaveBeenCalledWith(body);
    expect(mockCompleteIdempotentResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "valid-key-12345",
        statusCode: 200,
      })
    );
    expect(json.success).toBe(true);
  });

  test("returns stored response when key already completed", async () => {
    mockClaimIdempotencyKey.mockImplementation(() =>
      Promise.resolve({ claimed: false })
    );
    mockGetIdempotentResponse.mockImplementation(() =>
      Promise.resolve({
        pending: false,
        statusCode: 200,
        response: {
          success: true,
          message: "replayed",
          status: 200,
          data: { reference: "CON-OLD" },
        },
      })
    );

    const req = jsonRequest(
      "http://localhost/api/payments/initialize",
      {
        purpose: "CONTESTANT",
        method: "PAYSTACK",
        eventId: "event_1",
        email: "a@b.com",
        name: "Jane Doe",
      },
      { "Idempotency-Key": "valid-key-12345" }
    );

    const res = await initializePOST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("replayed");
    expect(mockInitialize).not.toHaveBeenCalled();
  });
});

describe("POST /api/payments/verify", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 when reference missing", async () => {
    const req = jsonRequest("http://localhost/api/payments/verify", {});

    const res = await verifyPOST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(mockVerify).not.toHaveBeenCalled();
    expect(json.success).toBe(false);
  });

  test("calls paymentService.verify with reference", async () => {
    const req = jsonRequest("http://localhost/api/payments/verify", {
      reference: "CON-ABC123456789",
    });

    const res = await verifyPOST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(mockVerify).toHaveBeenCalledWith("CON-ABC123456789");
    expect(json.success).toBe(true);
  });
});

describe("POST /api/payments/resend-email", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 when reference invalid", async () => {
    const req = jsonRequest("http://localhost/api/payments/resend-email", {
      reference: "short",
    });

    const res = await resendPOST(req);
    expect(res.status).toBe(400);
  });

  test("returns 404 when payment not found", async () => {
    mockFindByReference.mockImplementation(() => Promise.resolve(null));

    const req = jsonRequest("http://localhost/api/payments/resend-email", {
      reference: "CON-ABC123456789",
    });

    const res = await resendPOST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.message).toMatch(/not found/i);
  });

  test("returns 400 when payment not SUCCESS", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve({
        reference: "CON-ABC123456789",
        status: "PENDING",
        purpose: "CONTESTANT",
      })
    );

    const req = jsonRequest("http://localhost/api/payments/resend-email", {
      reference: "CON-ABC123456789",
    });

    const res = await resendPOST(req);
    expect(res.status).toBe(400);
  });

  test("routes TICKET to ticketService.resendTicketEmail", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve({
        reference: "TIK-ABC123456789",
        status: "SUCCESS",
        purpose: "TICKET",
      })
    );

    const req = jsonRequest("http://localhost/api/payments/resend-email", {
      reference: "TIK-ABC123456789",
    });

    const res = await resendPOST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(mockResendTicketEmail).toHaveBeenCalledWith("TIK-ABC123456789");
    expect(mockResendContestantFormLink).not.toHaveBeenCalled();
    expect(json.success).toBe(true);
  });

  test("routes CONTESTANT to contestantService.resendContestantFormLink", async () => {
    mockFindByReference.mockImplementation(() =>
      Promise.resolve({
        reference: "CON-ABC123456789",
        status: "SUCCESS",
        purpose: "CONTESTANT",
      })
    );

    const req = jsonRequest("http://localhost/api/payments/resend-email", {
      reference: "CON-ABC123456789",
    });

    const res = await resendPOST(req);

    expect(res.status).toBe(200);
    expect(mockResendContestantFormLink).toHaveBeenCalledWith(
      "CON-ABC123456789"
    );
    expect(mockResendTicketEmail).not.toHaveBeenCalled();
  });
});