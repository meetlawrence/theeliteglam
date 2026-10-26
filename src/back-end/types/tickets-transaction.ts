export type TicketTransactionStatus =
  | "ABANDONED"
  | "FAILED"
  | "ONGOING"
  | "PENDING"
  | "PROCESSING"
  | "QUEUED"
  | "REVERSED"
  | "SUCCESS"
  | "USED";

export interface TicketType {
  ticketTypeId: string;
  eventId: string;
  name: string;
  email: string;
  phoneNumber: string;
  quantity: number;
}

export interface UpdateTicketTransaction {
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: TicketTransactionStatus;
  clamed?: boolean
}

export interface TicketTransaction {
  name: string;
  email: string;
  phoneNumber?: string;
  eventId: string;
  ticketTypeId: string;
  amount?: number;
  quantity: number;
  total: number;
  reference: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PriceValidationResult {
  success: boolean;
  status: number;
  message?: string;
  price: number;
}

// Result of quantity validation
export interface QuantityValidationResult {
  success: boolean;
  status: number;
  message?: string;
  quantity?: number;
}

// Result of total ticket price calculation
export interface TotalTicketPriceResult {
  success: boolean;
  status: number;
  message?: string;
  total?: number;
}
