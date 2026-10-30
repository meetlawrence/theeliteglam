import bcrypt from "bcryptjs";
import { adminRepo } from "../models/admin-models";
import { tokenRepo } from "../models/token-models";
import { JWT } from "../lib/utils/jwt";
import { sendEmail } from "../lib/email/resend";
import { AUTH_CONFIG } from "../config/auth";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} from "../lib/validation/auth-schema";

import type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth-types";

import { formatZodError } from "../lib/utils/helper";

export class AuthService {
  // ====================== SIGNUP ======================
  async signup(data: RegisterInput): Promise<AuthResponse> {
    try {
      // Server-side validation
      const validation = registerSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error) };
      }

      // Check if user already exists
      const existingUser = await adminRepo.findByEmail(validation.data.email);
      if (existingUser) {
        return { success: false, message: "User with this email already exists." };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, AUTH_CONFIG.BCRYPT_SALT_ROUNDS);

      // Create user
      const admin = await adminRepo.create({
        name: validation.data.name,
        email: validation.data.email.toLowerCase(),
        passwordHash,
      });

      return {
        success: true,
        message: "Account created successfully. Awaiting admin permission before login.",
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "Failed to create account. Please try again." };
    }
  }

  // ====================== LOGIN ======================
  async login(data: LoginInput): Promise<AuthResponse> {
    try {
      // Server-side validation
      const validation = loginSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error) };
      }

      const admin = await adminRepo.findByEmail(validation.data.email);
      if (!admin) {
        return { success: false, message: "Invalid email or password." };
      }

      const isPasswordValid = await bcrypt.compare(validation.data.password, admin.passwordHash);
      if (!isPasswordValid) {
        return { success: false, message: "Invalid email or password." };
      }

      if (!admin.permitted) {
        return { success: false, message: "Your account is not permitted to log in." };
      };

      const accessToken = await JWT.signAccessToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        type: "ACCESS",
      });

      const refreshToken = await JWT.signRefreshToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        type: "REFRESH",
      });

      await tokenRepo.createRefreshToken(
        admin.id,
        refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      );

      return {
        success: true,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  }

  // ====================== LOGOUT ======================

  // ====================== FORGOT PASSWORD ======================
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const validation = forgotPasswordSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error) };
      }

      const admin = await adminRepo.findByEmail(validation.data.email);
      if (!admin) {
        return { success: true }; // Don't reveal if email exists (security best practice)
      }

      const resetToken = await JWT.signAccessToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        type: "RESET",
      });

      const resetUrl = `${AUTH_CONFIG.BASE_URL}/api/auth/reset-password?token=${resetToken}`;

      await sendEmail(admin.email, {
        type: "password-reset",
        props: {
          firstName: admin.name.split(" ")[0] || admin.name,
          resetUrl,
        },
      });

      return { success: true, message: "Password reset link sent to your email." };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, message: "Failed to send reset link." };
    }
  }

  // ====================== RESET PASSWORD ======================
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const validation = resetPasswordSchema.safeParse(data);
      if (!validation.success) {
        return { success: false, message: formatZodError(validation.error) };
      }

      const payload = await JWT.verifyToken(validation.data.token);
      if (payload.type !== "RESET") {
        return { success: false, message: "Invalid reset token." };
      }

      const passwordHash = await bcrypt.hash(data.newPassword, AUTH_CONFIG.BCRYPT_SALT_ROUNDS);

      await adminRepo.update(payload.adminId, { passwordHash });

      // Send confirmation email
      const admin = await adminRepo.findById(payload.adminId);
      if (admin) {
        await sendEmail(admin.email, {
          type: "password-changed",
          props: { firstName: admin.name.split(" ")[0] || admin.name },
        });
      }

      return { success: true, message: "Password has been reset successfully." };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, message: "Invalid or expired reset link." };
    }
  }

}

export const authService = new AuthService();
