import type { PaymentGateway } from "./payment-gateway";
import type {
  GatewayInitializeResult,
  GatewayVerifyResult,
} from "@/back-end/types/payment-types";

export class OPayGateway implements PaymentGateway {
  async initialize(): Promise<GatewayInitializeResult> {
    return {
      authorizationUrl: "",
      reference: "",
    };
  }

  async verify(): Promise<GatewayVerifyResult> {
    return {
      status: false,
      reference: "",
      amount: 0,
      gatewayResponse: "OPay gateway is not implemented yet",
    };
  }
}

export const opayGateway = new OPayGateway();