// src/types/user-types.ts
import type { AdminRole, RefreshToken } from "./token-types";

export interface Admin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  permitted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  role: AdminRole;
  isActive: boolean;
  refreshTokens?: RefreshToken[]; // ← Fixed with import
}

// NEW: Safe interface for updates (no relations)
export interface AdminUpdateData {
  name?: string;
  email?: string;
  passwordHash?: string;
  permitted?: boolean;
  lastLoginAt?: Date | null;
  role?: AdminRole;
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
  role?: AdminRole;
}

export interface UpdateAdminInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  role?: AdminRole;
}

export interface AdminResponse {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  permitted: boolean;
  lastLogin?: Date;
  createdAt?: Date;
}
