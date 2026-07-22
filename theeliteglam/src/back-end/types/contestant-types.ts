export interface CreateContestantInput {
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  avatar?: string;
  stageName?: string;
  height: number;
  weight: number;
  bio?: string;
  portfolio?: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  country: string;
  contestantCategories: "MALE" | "FEMALE";
  eventId: string;
}

export interface UpdateContestantInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  stageName?: string;
  bio?: string;
  portfolio?: string;
  isVerified?: boolean;
  score?: number;
  rank?: number;
  contestantCategories?: "MALE" | "FEMALE";
  eventId?: string;
}

export interface ContestantResponse {
  id: string;
  name: string;
  email: string;
  stageName?: string;
  gender: string;
  avatar?: string;
  isVerified: boolean;
  contestantCategories?: "MALE" | "FEMALE";
  score?: number;
  rank?: number;
  createdAt: Date;
}
