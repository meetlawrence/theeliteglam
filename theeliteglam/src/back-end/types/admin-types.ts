// src/types/user-types.ts
import type { RefreshToken } from "./token-types";

export interface Admin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
  role: "SUPER_ADMIN" | "ADMIN";
  refreshTokens?: RefreshToken[]; // ← Fixed with import
}

// NEW: Safe interface for updates (no relations)
export interface AdminUpdateData {
  name?: string;
  email?: string;
  passwordHash?: string;
  emailVerified?: boolean;
  emailVerifiedAt?: Date | null;
  lastLoginAt?: Date | null;
  role?: "SUPER_ADMIN" | "ADMIN";
  status?: "ACTIVE" | "SUSPENDED" | "DELETED";
}

export interface PublicAdmin {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
}

export interface CreateAdminData {
  name: string;
  email: string;
  passwordHash: string;
  emailVerified?: boolean;
  emailVerifiedAt?: Date | null;
  lastLoginAt?: Date | null;
  role?: "SUPER_ADMIN" | "ADMIN";
}
