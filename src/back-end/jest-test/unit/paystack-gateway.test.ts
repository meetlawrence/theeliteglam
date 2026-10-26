import "dotenv/config";

import { describe, expect, test, jest, beforeEach, afterEach } from "@jest/globals";

const mockFetch = jest.fn(
  (_input: RequestInfo | URL, _init?: RequestInit): Promise<Response> =>
    Promise.resolve(new Response())
);

global.fetch = mockFetch as typeof fetch;

// Ensure secret exists for most tests
const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = {
    ...ORIGINAL_ENV,
    PAYSTACK_SECRET_KEY: "sk_test_123",
    PAYSTACK_CALLBACK_URL: "http://localhost:3000/callback",
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

// Import after env setup pattern; module reads secret at call time in your gateway
import { PaystackGateway } from "@/back-end/services/payment-services/paystack-gateway";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("PaystackGateway.initialize", () => {
  const gateway = new PaystackGateway();

  test("fails when secret key is missing", async () => {
    delete process.env.PAYSTACK_SECRET_KEY;

    const result = await gateway.initialize({
      email: "a@b.com",
      amount: 1000,
      reference: "CON-ABC123456789",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Payments are temporarily unavailable. Please try again later.");
  });

  test("fails on invalid response shape", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(jsonResponse({ foo: "bar" }))
    );

    const result = await gateway.initialize({
      email: "a@b.com",
      amount: 1000,
      reference: "CON-ABC123456789",
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/unexpected/i);
  });

  test("fails when Paystack status is false", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        jsonResponse({
          status: false,
          message: "Invalid key",
        })
      )
    );

    const result = await gateway.initialize({
      email: "a@b.com",
      amount: 1000,
      reference: "CON-ABC123456789",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("We couldn't start your payment. Please try again.");
  });

  test("returns authorization data on success", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        jsonResponse({
          status: true,
          message: "Authorization URL created",
          data: {
            authorization_url: "https://checkout.paystack.com/abc",
            access_code: "access_abc",
            reference: "CON-ABC123456789",
          },
        })
      )
    );

    const result = await gateway.initialize({
      email: "a@b.com",
      amount: 50,
      reference: "CON-ABC123456789",
    });

    expect(result.success).toBe(true);
    expect(result.authorizationUrl).toBe("https://checkout.paystack.com/abc");
    expect(result.accessCode).toBe("access_abc");
    expect(result.gatewayReference).toBe("CON-ABC123456789");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("fails when fetch throws", async () => {
    mockFetch.mockImplementation(() =>
      Promise.reject(new Error("network down"))
    );

    const result = await gateway.initialize({
      email: "a@b.com",
      amount: 1000,
      reference: "CON-ABC123456789",
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/unavailable/i);
  });
});

describe("PaystackGateway.verify", () => {
  const gateway = new PaystackGateway();

  test("fails when secret key is missing", async () => {
    delete process.env.PAYSTACK_SECRET_KEY;

    const result = await gateway.verify("CON-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe("FAILED");
    expect(result.message).toBe("Payments are temporarily unavailable. Please try again later.");
  });

  test("fails on invalid response shape", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(jsonResponse({ broken: true }))
    );

    const result = await gateway.verify("CON-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/unexpected/i);
  });

  test("maps success and converts kobo to naira", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        jsonResponse({
          status: true,
          message: "Verification successful",
          data: {
            status: "success",
            reference: "CON-ABC123456789",
            amount: 500000, // kobo
            currency: "NGN",
          },
        })
      )
    );

    const result = await gateway.verify("CON-ABC123456789");

    expect(result.success).toBe(true);
    expect(result.status).toBe("SUCCESS");
    expect(result.amount).toBe(5000); // naira
    expect(result.currency).toBe("NGN");
    expect(result.gatewayReference).toBe("CON-ABC123456789");
  });

  test("maps failed gateway status", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve(
        jsonResponse({
          status: true,
          data: {
            status: "failed",
            reference: "CON-ABC123456789",
            amount: 10000,
            currency: "NGN",
          },
        })
      )
    );

    const result = await gateway.verify("CON-ABC123456789");

    expect(result.success).toBe(true);
    expect(result.status).toBe("FAILED");
  });

  test("fails when fetch throws", async () => {
    mockFetch.mockImplementation(() =>
      Promise.reject(new Error("network down"))
    );

    const result = await gateway.verify("CON-ABC123456789");

    expect(result.success).toBe(false);
    expect(result.status).toBe("FAILED");
  });
});