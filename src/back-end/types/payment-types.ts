export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status:
      | "ABANDONED"
      | "FAILED"
      | "ONGOING"
      | "PENDING"
      | "PROCESSING"
      | "QUEUED"
      | "REVERSED"
      | "SUCCESS"; // Paystack statuses
    reference: string;
    receipt_number: string | null;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string; // ISO date string
    created_at: string; // ISO date string
    channel: string;
    currency: string;
    ip_address: string;
    metadata: string | null;
    log: {
      start_time: number;
      time_spent: number;
      attempts: number;
      errors: number;
      success: boolean;
      mobile: boolean;
      input: string[];
      history: {
        type: string;
        message: string;
        time: number;
      }[];
    };
    fees: number;
    fees_split: null | Record<string, unknown>;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: string | null;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: string | null;
    split: Record<string, unknown>;
    order_id: string | null;
    paidAt: string; // ISO date string
    createdAt: string; // ISO date string
    requested_amount: number;
    pos_transaction_data: null | Record<string, unknown>;
    source: null | Record<string, unknown>;
    fees_breakdown: null | Record<string, unknown>;
    connect: null | Record<string, unknown>;
    transaction_date: string; // ISO date string
    plan_object: Record<string, unknown>;
    subaccount: Record<string, unknown>;
  };
}

export type PaymentPurpose = "REGISTRATION" | "VOTING" | "TICKET" | "CONTESTANT";
export type PaymentGateway = "PAYSTACK" | "OPAY";

export type GatewayInitializeResult = {
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  accessCode?: string;
  gatewayReference?: string;
  message?: string;
  raw?: unknown;
};

export type GatewayVerifyResult = {
  success: boolean;
  status: "SUCCESS" | "FAILED" | "PENDING";
  amount: number;
  gatewayReference?: string;
  currency?: string;
  message?: string;
  raw?: unknown;
};

export type InitializePaymentInput = {
  email: string;
  amount: number;
  reference: string;
  purpose: Extract<PaymentPurpose, "TICKET" | "CONTESTANT">;
  method: PaymentGateway;
  metadata?: Record<string, string>;
  callbackUrl?: string;
  eventId: string;
  ticketTypeId?: string;
  quantity?: number;
  name?: string;
  phoneNumber?: string;
};

export type PaymentResult = {
  success: boolean;
  message: string;
  status: number;
  data?: unknown;
};