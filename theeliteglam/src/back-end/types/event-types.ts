export interface CreateEventInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  categories?: string[];
  // Array of category names
}

export interface UpdateEventInput {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  categories?: string[];
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}
