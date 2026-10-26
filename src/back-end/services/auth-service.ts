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

      // Generate verification token
      const verifyToken = await JWT.signAccessToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        type: "VERIFY",
      });

      const verifyUrl = `${AUTH_CONFIG.BASE_URL}/auth/verify-email?token=${verifyToken}`;

      // Send verification email
      await sendEmail(admin.email, {
        type: "verification",
        props: {
          firstName: admin.name.split(" ")[0] || admin.name,
          verifyUrl,
        },
      });

      return {
        success: true,
        message: "Account created successfully. Please check your email to verify.",
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

      if (!admin.emailVerified) {
        // Generate fresh verification token
        const verifyToken = await JWT.signAccessToken({
          adminId: admin.id,
          email: admin.email,
          role: admin.role,
          type: "VERIFY",
        });

        const verifyUrl = `${AUTH_CONFIG.BASE_URL}/auth/verify-email?token=${verifyToken}`;

        // Resend verification email
        await sendEmail(admin.email, {
          type: "verification",
          props: {
            firstName: admin.name.split(" ")[0] || admin.name,
            verifyUrl,
          },
        });

        return {
          success: false,
          message:
            "Please verify your email address first. We have sent a new verification link to your inbox.",
        };
      }

      // ====================== SEND LOGIN ALERT EMAIL ======================
      await sendEmail(admin.email, {
        type: "login-alert",
        props: {
          firstName: admin.name.split(" ")[0] || admin.name,
          time: new Date().toLocaleString(),
          device: "New Device", // You can enhance this later with real device detection
          location: "Unknown Location", // You can enhance with IP geolocation later
          ipAddress: "Unknown IP", // You can enhance with real IP detection later
        },
      });

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

  // ====================== VERIFY EMAIL ======================
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const payload = await JWT.verifyToken(token);
      if (payload.type !== "VERIFY") {
        return { success: false, message: "Invalid verification token." };
      }

      await adminRepo.markEmailVerified(payload.adminId);

      return {
        success: true,
        message: "Email verified successfully. You can now login.",
      };
    } catch (error) {
      console.error("Verify email error:", error);
      return { success: false, message: "Invalid or expired verification link." };
    }
  }

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

  // ====================== RESEND VERIFICATION ======================
  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const admin = await adminRepo.findByEmail(email);
      if (!admin) {
        return { success: false, message: "User not found." };
      }

      if (admin.emailVerified) {
        return { success: false, message: "Email is already verified." };
      }

      // Generate new verification token
      const verifyToken = await JWT.signAccessToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        type: "VERIFY",
      });

      const verifyUrl = `${AUTH_CONFIG.BASE_URL}/auth/verify-email?token=${verifyToken}`;

      // Send email
      await sendEmail(admin.email, {
        type: "verification",
        props: {
          firstName: admin.name.split(" ")[0] || admin.name,
          verifyUrl,
        },
      });

      return {
        success: true,
        message: "Verification email has been sent successfully.",
      };
    } catch (error) {
      console.error("Resend verification error:", error);
      return { success: false, message: "Failed to resend verification email." };
    }
  }
}

export const authService = new AuthService();
