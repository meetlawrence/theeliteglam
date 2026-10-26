import { prisma } from "@/back-end/db/db-connect";

const TTL_HOURS = 24;
const MAX_KEY_LENGTH = 128;

export function validateIdempotencyKey(key: string | null): string | null {
  if (!key) return null;
  const trimmed = key.trim();
  if (trimmed.length < 8 || trimmed.length > MAX_KEY_LENGTH) return null;
  return trimmed;
}

export async function claimIdempotencyKey(params: {
  key: string;
  method: string;
  path: string;
}) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await prisma.idempotencyKey.create({
      data: {
        key: params.key,
        method: params.method,
        path: params.path,
        statusCode: 0, // 0 = pending
        response: {},
        expiresAt,
      },
    });

    return { claimed: true as const };
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { claimed: false as const };
    }
    throw error;
  }
}

export async function getIdempotentResponse(key: string) {
  const record = await prisma.idempotencyKey.findUnique({
    where: { key },
  });

  if (!record) return null;

  // Expired → clean up
  if (record.expiresAt < new Date()) {
    await prisma.idempotencyKey.delete({ where: { key } }).catch(() => {});
    return null;
  }

  // Still processing
  if (record.statusCode === 0) {
    return { pending: true as const };
  }

  return {
    pending: false as const,
    statusCode: record.statusCode,
    response: record.response,
  };
}

export async function completeIdempotentResponse(params: {
  key: string;
  statusCode: number;
  response: unknown;
}) {
  await prisma.idempotencyKey.update({
    where: { key: params.key },
    data: {
      statusCode: params.statusCode,
      response: params.response as any,
    },
  });
}