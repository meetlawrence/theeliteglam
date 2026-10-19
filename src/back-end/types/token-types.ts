import type { JWTPayload } from "jose";
import type { NextRequest } from "next/server";

export type TokenType = "ACCESS" | "REFRESH" | "RESET" | "VERIFY";

export interface TokenPayload extends JWTPayload {
  adminId: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  type: TokenType;
}

export interface AuthenticatedRequest extends NextRequest {
  admin?: { adminId: string; email: string; role: "SUPER_ADMIN" | "ADMIN" };
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
