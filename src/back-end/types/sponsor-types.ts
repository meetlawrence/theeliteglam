export interface CreateSponsorInput {
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  tier: "GOLD" | "SILVER" | "BRONZE";
  eventId: string;
}

export interface UpdateSponsorInput {
  name?: string;
  logo?: string;
  website?: string;
  description?: string;
  tier?: "GOLD" | "SILVER" | "BRONZE";
}

export interface SponsorResponse {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  tier: "GOLD" | "SILVER" | "BRONZE";
  eventId: string;
  createdAt: Date;
}
