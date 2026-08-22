import type {
  PaymentTransaction,
  Ticket,
  Contestant,
  Event,
  TicketType,
  PaymentPurpose,
  PaymentGateway,
  PaymentStatus,
  FulfillmentStatus,
  TicketStatus,
} from "@/back-end/database/generated/prisma/client";

// ======================
// Re-export Prisma types (source of truth)
// ======================
export type {
  PaymentTransaction,
  Ticket,
  Contestant,
  Event,
  TicketType,
  PaymentPurpose,
  PaymentGateway,
  PaymentStatus,
  FulfillmentStatus,
  TicketStatus,
};

// ======================
// Input types (for API / service)
// ======================
export type InitializeTicketPaymentInput = {
  purpose: "TICKET";
  method: PaymentGateway;
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  email: string;
  phoneNumber?: string;
  name?: string;
};

export type InitializeContestantPaymentInput = {
  purpose: "CONTESTANT";
  method: PaymentGateway;
  eventId: string;
  email: string;
  phoneNumber?: string;
  name: string;
};

export type InitializePaymentInput =
  | InitializeTicketPaymentInput
  | InitializeContestantPaymentInput;

// ======================
// Gateway contracts
// ======================
export type GatewayInitializeResult = {
  success: boolean;
  authorizationUrl?: string;
  accessCode?: string;
  gatewayReference?: string;
  message?: string;
  raw?: unknown;
};

export type GatewayVerifyResult = {
  success: boolean;
  status: PaymentStatus;
  amount: number;
  currency?: string;
  gatewayReference?: string;
  message?: string;
  raw?: unknown;
};

// ======================
// Service response type
// ======================
export type PaymentResult = {
  success: boolean;
  message: string;
  status: number;
  data?: any;
};

// ======================
// Useful derived types
// ======================
export type PaymentTransactionWithRelations = PaymentTransaction & {
  tickets?: Ticket[];
  contestant?: Contestant | null;
  event?: Event;
};