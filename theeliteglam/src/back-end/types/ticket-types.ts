export interface TicketType {
  name: string;
  price: number;
  capacity?: number;
  benefits: string[];
  eventId: string;
}

export interface UpdateTicketType {
  name?: string;
  price?: number;
  capacity?: number;
  benefits?: string[];
}
