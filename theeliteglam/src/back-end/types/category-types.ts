export interface CreateCategoryInput {
  name: string;
  eventId: string;
}

export interface UpdateCategoryInput {
  name?: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  eventId: string;
  createdAt: Date;
}