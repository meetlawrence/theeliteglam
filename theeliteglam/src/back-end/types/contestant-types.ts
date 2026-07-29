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
}

export interface UpdateContestantInput {
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  stageName?: string;
  bio?: string;
  portfolio?: string;
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
  status?: "ACTIVE" | "INACTIVE";
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
