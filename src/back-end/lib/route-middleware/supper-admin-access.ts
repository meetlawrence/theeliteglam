import { JWT } from "../utils/jwt";

export type ApiDocsAccessResult =
  | { allowed: true }
  | { allowed: false; status: 401 | 403 };

export async function verifyApiDocsAccess(
  accessToken: string | undefined,
): Promise<ApiDocsAccessResult> {
  if (!accessToken) {
    return { allowed: false, status: 401 };
  }

  try {
    const payload = await JWT.verifyAccessToken(accessToken);
    return payload.role === "SUPER_ADMIN"
      ? { allowed: true }
      : { allowed: false, status: 403 };
  } catch {
    return { allowed: false, status: 401 };
  }
}
