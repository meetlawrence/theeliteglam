import type { PaymentGateway } from "./payment-gateway";
import type {
  GatewayInitializeResult,
  GatewayVerifyResult,
} from "@/back-end/types/payment-types";
import {
  paystackInitializeResponseSchema,
  paystackVerifyResponseSchema,
} from "@/back-end/lib/validation/paystack-validation";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = "https://api.paystack.co";

function toKobo(amount: number) {
  return Math.round(Number(amount) * 100);
}

export class PaystackGateway implements PaymentGateway {
  async initialize(input: {
    email: string;
    amount: number;
    reference: string;
    callbackUrl?: string;
    metadata?: Record<string, string>;
  }): Promise<GatewayInitializeResult> {
    try {
      if (!PAYSTACK_SECRET) {
        return {
          success: false,
          message: "Paystack secret key is not configured",
        };
      }

      const res = await fetch(`${BASE_URL}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: input.email,
          amount: toKobo(input.amount),
          reference: input.reference,
          callback_url: process.env.PAYSTACK_CALLBACK_URL,
          metadata: input.metadata,
        }),
      });

      const json = await res.json();
      const parsed = paystackInitializeResponseSchema.safeParse(json);

      if (!parsed.success) {
        console.error("[PaystackGateway.initialize] Invalid response", parsed.error);
        return {
          success: false,
          message: "Unexpected response from Paystack",
          raw: json,
        };
      }

      const data = parsed.data;

      if (!res.ok || !data.status || !data.data) {
        return {
          success: false,
          message: data.message || "Paystack initialization failed",
          raw: json,
        };
      }

      return {
        success: true,
        authorizationUrl: data.data.authorization_url,
        accessCode: data.data.access_code,
        gatewayReference: data.data.reference,
        raw: json,
      };
    } catch (error) {
      console.error("[PaystackGateway.initialize]", error);
      return {
        success: false,
        message: "Paystack service unavailable",
      };
    }
  }

  async verify(reference: string): Promise<GatewayVerifyResult> {
    try {
      if (!PAYSTACK_SECRET) {
        return {
          success: false,
          status: "FAILED",
          amount: 0,
          message: "Paystack secret key is not configured",
        };
      }

      const res = await fetch(
        `${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
          },
        }
      );

      const json = await res.json();
      const parsed = paystackVerifyResponseSchema.safeParse(json);

      if (!parsed.success) {
        console.error("[PaystackGateway.verify] Invalid response", parsed.error);
        return {
          success: false,
          status: "FAILED",
          amount: 0,
          message: "Unexpected response from Paystack",
          raw: json,
        };
      }

      const data = parsed.data;

      if (!res.ok || !data.status || !data.data) {
        return {
          success: false,
          status: "FAILED",
          amount: 0,
          message: data.message || "Verification failed",
          raw: json,
        };
      }

      const tx = data.data;

      const status =
        tx.status === "success"
          ? "SUCCESS"
          : tx.status === "failed"
            ? "FAILED"
            : "PENDING";

      return {
        success: true,
        status,
        amount: Number(tx.amount) / 100,
        currency: tx.currency,
        gatewayReference: tx.reference,
        raw: json,
      };
    } catch (error) {
      console.error("[PaystackGateway.verify]", error);
      return {
        success: false,
        status: "FAILED",
        amount: 0,
        message: "Paystack verification unavailable",
      };
    }
  }
}

export const paystackGateway = new PaystackGateway();