import "server-only";

import { headers } from "next/headers";
import { getEventStatus } from "@/back-end/lib/utils/get-event-status";

interface ServerApiOptions extends RequestInit {
  forwardCookies?: boolean;
}

export interface EventStatus {
  isRegistrationOpen: boolean;
  isTicketsOpen: boolean;
  isVotingOpen: boolean;
  isContestantsVisible: boolean;
}

export async function fetchServerApi(path: string, options: ServerApiOptions = {}) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.NODE_ENV === "development"
      ? `http://localhost:${process.env.PORT ?? "3000"}`
      : undefined);

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL must be configured for server-side API requests.");
  }

  const origin = new URL(baseUrl);
  if (origin.protocol !== "http:" && origin.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_BASE_URL must use HTTP or HTTPS.");
  }

  const { forwardCookies = false, headers: requestHeaders, ...requestOptions } = options;
  const headersList = new Headers(requestHeaders);

  if (forwardCookies) {
    const cookie = (await headers()).get("cookie");
    if (cookie) headersList.set("cookie", cookie);
  }

  return fetch(new URL(path, origin), {
    ...requestOptions,
    headers: headersList,
    cache: requestOptions.cache ?? "no-store",
  });
}

export async function fetchEventStatus(): Promise<EventStatus> {
  return getEventStatus();
}
