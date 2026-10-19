// src/back-end/models/token-models.ts
import "dotenv/config";

import { prisma } from "../../back-end/db/db-connect";
import type { RefreshToken } from "../types/token-types";

export class TokenRepo {
  async createRefreshToken(adminId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        adminId,
        token,
        expiresAt,
        revoked: false,
      },
    });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { admin: true },
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }

    async revokeAllUserTokens(adminId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { adminId, revoked: false },
      data: { revoked: true },
    });
  }
}

export const tokenRepo = new TokenRepo();
