import type { AdminRole } from "./token-types";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPassword {
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  admin?: {
    id: string;
    name: string;
    email: string;
    permitted: boolean;
    createdAt: Date;
    role: AdminRole;
  };
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}
