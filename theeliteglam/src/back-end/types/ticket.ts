
export type TicketStatus =
  | "PENDING"
  | "SEND"
  | "USED";

  export interface Ticket {
  reference: string;
  status: TicketStatus;
  ticketTransactionId: string;
}

  export interface UpdateTicket {
  status?: TicketStatus;
}