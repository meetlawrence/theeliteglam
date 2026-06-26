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
  lastLoginAt: Date | null;
  role: "SUPER_ADMIN" | "ADMIN";
  isActive: boolean;
  refreshTokens?: RefreshToken[]; // ← Fixed with import
}

// NEW: Safe interface for updates (no relations)
export interface AdminUpdateData {
  name?: string;
  email?: string;
  passwordHash?: string;
  emailVerified?: boolean;
  lastLoginAt?: Date | null;
}

export interface CreateAdminData {
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
}

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "SUPER_ADMIN";
}

export interface UpdateAdminInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  role?: "SUPER_ADMIN" | "ADMIN";
}

export interface AdminResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}
