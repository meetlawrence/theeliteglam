export type TicketMetric = {
  label: string;
  value: string;
  note: string;
};

export type TicketSalePoint = {
  day: string;
  sold: number;
  revenue: number;
};

export type TicketCategory = {
  type: string;
  price: string;
  sold: number;
  available: number;
  revenue: string;
};

export type TicketTransaction = {
  id: string;
  buyer: string;
  ticketType: string;
  quantity: number;
  total: string;
  status: "Completed" | "Pending" | "Refunded";
};

export type TicketVerificationRecord = {
  code: string;
  buyer: string;
  ticketType: string;
  status: "Valid" | "Invalid" | "Already Used";
  timestamp: string;
};
