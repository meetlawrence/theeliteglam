export interface CreateEventInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  categories: "MALE" | "FEMALE";
  contestantFee: number;
  // Array of category names
}

export interface UpdateEventInput {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  categories?: "MALE" | "FEMALE";
  contestantFee?: number;
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  categories: "MALE" | "FEMALE";
  createdAt: Date;
  updatedAt: Date;
}
