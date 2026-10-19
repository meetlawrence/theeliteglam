import type {
  GatewayInitializeResult,
  GatewayVerifyResult,
} from "@/back-end/types/payment-types";

export interface PaymentGateway {
  initialize(input: {
    email: string;
    amount: number;
    reference: string;
    callbackUrl?: string;
    metadata?: Record<string, string>;
  }): Promise<GatewayInitializeResult>;

  verify(reference: string): Promise<GatewayVerifyResult>;
}