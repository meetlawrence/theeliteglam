import type { PaymentGateway } from "./payment-gateway";
import type {
  GatewayInitializeResult,
  GatewayVerifyResult,
} from "@/back-end/types/payment-types";

export class OPayGateway implements PaymentGateway {
  async initialize(): Promise<GatewayInitializeResult> {
    return {
      success: false,
      message: "OPay gateway is not implemented yet",
    };
  }

  async verify(): Promise<GatewayVerifyResult> {
    return {
      success: false,
      status: "FAILED",
      amount: 0,
      message: "OPay gateway is not implemented yet",
    };
  }
}

export const opayGateway = new OPayGateway();