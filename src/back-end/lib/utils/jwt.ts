import "dotenv/config";
import { SignJWT, jwtVerify, CompactEncrypt, compactDecrypt, decodeJwt } from "jose";
import type { TokenPayload } from "../../types/token-types";
import { AUTH_CONFIG } from "../../config/auth";
import { TICKET_CONFIG } from "../../config/ticket"
import { TicketStatus } from "../../types/ticket"

const SIGNING_KEY = new TextEncoder().encode(
  AUTH_CONFIG.JWT_SIGNING_SECRET ?? AUTH_CONFIG.JWT_SECRET,
);

const ENCRYPTION_KEY = Buffer.from(
  AUTH_CONFIG.JWT_ENCRYPTION_SECRET ?? AUTH_CONFIG.JWT_SECRET,
  "base64",
);

if (ENCRYPTION_KEY.length !== 32) {
  console.warn("[TokenService] JWT_ENCRYPTION_SECRET should be exactly 32 bytes for A256GCM.");
}

const ISSUER = "theeliteglam";
const AUDIENCE = "theeliteglam-users";

export class JWT {
  /**
   * Base Sign Function (DRY)
   */
  private static async signToken(payload: TokenPayload, expiresIn: string): Promise<string> {
    /**
     * Step 1
     * Create Signed JWT (JWS)
     */
    const signedJwt = await new SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
        typ: "JWT",
        kid: "v1",
      })
      .setIssuedAt()
      .setNotBefore("0s")
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setExpirationTime(expiresIn)
      .sign(SIGNING_KEY);

    /**
     * Step 2
     * Encrypt the signed JWT
     */

    const jwe = await new CompactEncrypt(new TextEncoder().encode(signedJwt))
      .setProtectedHeader({
        alg: "dir",
        enc: "A256GCM",
        cty: "JWT",
        kid: "v1",
      })
      .encrypt(ENCRYPTION_KEY);

    return jwe;
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
   * ------------------------------------------------------------------------
   * Verify Token
   *
   * Decrypt JWE
   * Verify inner JWS
   * ------------------------------------------------------------------------
   */
  static async verifyToken(token: string): Promise<TokenPayload> {
    /**
     * Step 1
     * Decrypt JWE
     */

    const { plaintext } = await compactDecrypt(token, ENCRYPTION_KEY);

    /**
     * Step 2
     * Convert plaintext → Signed JWT
     */

    const signedJwt = new TextDecoder().decode(plaintext);

    /**
     * Step 3
     * Verify Signature
     */

    const { payload } = await jwtVerify(signedJwt, SIGNING_KEY, {
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


/**
 * Ticket encryption
 */
const ticketSecret = new TextEncoder().encode(
  TICKET_CONFIG.TICKET_SECRET
);

const ticketEncryptionKey = Buffer.from(
  (TICKET_CONFIG.TICKET_ENCRYPTION_KEY ?? TICKET_CONFIG.TICKET_SECRET)!,  "base64",
);

if (ticketEncryptionKey.length !== 32) {
  console.warn("[TokenService] JWT_ENCRYPTION_SECRET should be exactly 32 bytes for A256GCM.");
}

export async function generateTicketToken(payload: {
  ticketId: string;
  reference: string;
  email: string;
  status: TicketStatus;
  name: string;
  index: number;
}) {
  const signedJwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d") // Ticket valid for 1 year (adjust as needed)
    .sign(ticketSecret);

  const jwe = await new CompactEncrypt(new TextEncoder().encode(signedJwt))
    .setProtectedHeader({
      alg: "dir",
      enc: "A256GCM",
      cty: "JWT",
      kid: "v1",
    })
    .encrypt(ticketEncryptionKey);

  return jwe;
}

export async function verifyTicketToken(token: string) {
  try {
    const { plaintext } = await compactDecrypt(token, ticketEncryptionKey);

    /**
     * Step 2
     * Convert plaintext → Signed JWT
     */

    const signedJwt = new TextDecoder().decode(plaintext);

    const { payload } = await jwtVerify(signedJwt, ticketSecret);
    return payload as {
      ticketId: string;
      reference: string;
      email: string;
      status: TicketStatus;
      name: string;
      index: number;
    };
  } catch (error) {
    return null;
  }
}
