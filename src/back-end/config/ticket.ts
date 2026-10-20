import "dotenv/config";

export const TICKET_CONFIG = {
  // JWT Settings (strings for jose library)
  TICKET_SECRET: process.env.TICKET_SECRET,
  TICKET_ENCRYPTION_KEY: process.env.TICKET_ENCRYPTION_KEY,
} as const;

export type Config = typeof TICKET_CONFIG;