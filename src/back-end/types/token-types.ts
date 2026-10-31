import type { JWTPayload } from "jose";
import type { NextRequest } from "next/server";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "TICKETS_VALIDATOR";
export type TokenType = "ACCESS" | "REFRESH" | "RESET";

export interface TokenPayload extends JWTPayload {
  adminId: string;
  email: string;
  role: AdminRole;
  type: TokenType;
}

export interface AuthenticatedRequest extends NextRequest {
  admin?: { adminId: string; email: string; role: AdminRole };
}

export interface RefreshToken {
  id: string;
  adminId: string;
  token: string;
  expiresAt: Date;
  revoked: boolean;
  createdAt: Date;
  admin?: {
    id: string;
    name: string;
    email: string;
  };
}
