import { SignJWT, jwtVerify } from "jose";
import type { TokenPayload } from "../../types/token-types";
import { AUTH_CONFIG } from "../../config/auth";

const JWT_SECRET = new TextEncoder().encode(AUTH_CONFIG.JWT_SECRET!);

const ISSUER = "autmint";
const AUDIENCE = "autmint-users";

export class JWT {
  /**
   * Base Sign Function (DRY)
   */
  private static async signToken(payload: TokenPayload, expiresIn: string): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setExpirationTime(expiresIn)
      .sign(JWT_SECRET);
  }

  /**
   * Access Token
   */
  static signAccessToken(payload: TokenPayload) {
    return this.signToken(payload, AUTH_CONFIG.JWT_ACCESS_EXPIRES);
  }

  /**
   * Refresh Token
   */
  static signRefreshToken(payload: TokenPayload) {
    return this.signToken(payload, AUTH_CONFIG.JWT_REFRESH_EXPIRES);
  }

  /**
   * Verify Token (with security checks)
   */
  static async verifyToken(token: string): Promise<TokenPayload> {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    return payload as TokenPayload;
  }

  /**
   * Enforce Access Token
   */
  static async verifyAccessToken(token: string): Promise<TokenPayload> {
    const payload = await this.verifyToken(token);

    if (payload.type !== "ACCESS") {
      throw new Error("Invalid token type");
    }

    return payload;
  }

  /**
   * Enforce Refresh Token
   */
  static async verifyRefreshToken(token: string): Promise<TokenPayload> {
    const payload = await this.verifyToken(token);

    if (payload.type !== "REFRESH") {
      throw new Error("Invalid token type");
    }

    return payload;
  }
}
