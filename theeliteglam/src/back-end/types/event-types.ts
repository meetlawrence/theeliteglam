export interface CreateEventInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
}

export interface UpdateEventInput {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}