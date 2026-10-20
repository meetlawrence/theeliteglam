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

export interface VerifyEmailRequest {
  token: string;
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
    emailVerified: boolean;
    createdAt: Date;
    role: "SUPER_ADMIN" | "ADMIN";
  };
  accessToken?: string;
  refreshToken?: string;
  message?: string; // ← Added
  error?: string;
}
