export type ContestantTransactionStatus =
  | "ABANDONED"
  | "FAILED"
  | "ONGOING"
  | "PENDING"
  | "PROCESSING"
  | "QUEUED"
  | "REVERSED"
  | "SUCCESS"
  | "USED";

export interface UpdateContestantTransaction {
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: ContestantTransactionStatus;
  formSent?: boolean
}

export interface ContestantTransaction {
  name: string;
  email: string;
  phoneNumber?: string;
  amount?: number;
  reference: string;
  eventId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PriceValidationResult {
  success: boolean;
  status: number;
  message?: string;
  price: number;
}

