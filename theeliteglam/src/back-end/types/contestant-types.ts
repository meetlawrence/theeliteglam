export interface CreateContestantInput {
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  image?: string;
  stageName?: string;
  height?: number;
  weight?: number;
  bio?: string;
  portfolio?: string;
  phone: string;
  age: number;
  state: string;
  country: string;
  occupation: string;
  advocacy: string;
  funFact: string;
  tribe: string;
  contestantCategories: "MALE" | "FEMALE";
  eventId: string;
  reference: string;
}

export interface UpdateContestantInput {
  name?: string;
  email?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE";
  image?: string | null;
  stageName?: string | null;
  height?: number | null;
  weight?: number | null;
  bio?: string | null;
  portfolio?: string | null;
  number?: number;
  age?: number;
  state?: string;
  country?: string;
  occupation?: string;
  advocacy?: string;
  funFact?: string;
  tribe?: string;
  isVerified?: boolean;
  score?: number;
  rank?: number;
  contestantCategories?: "MALE" | "FEMALE";
  eventId?: string;
  status?: "PENDING" | "ACTIVE" | "INACTIVE";
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

export interface ContestantTransaction {
  reference: string;
  status: boolean;
}
