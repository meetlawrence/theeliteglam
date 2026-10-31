"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SwaggerDocs from "./swagger-docs";

type AccessState =
  | { status: "checking" }
  | { status: "allowed"; spec: Record<string, unknown> }
  | { status: "forbidden" }
  | { status: "error" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default function ApiDocsPage() {
  const router = useRouter();
  const [accessState, setAccessState] = useState<AccessState>({
    status: "checking",
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadApiDocs() {
      setAccessState({ status: "checking" });

      try {
        const response = await fetch("/api/api-docs/access", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          router.replace("/admin");
          return;
        }

        if (response.status === 403) {
          setAccessState({ status: "forbidden" });
          return;
        }

        if (!response.ok) {
          throw new Error(`API documentation failed with HTTP ${response.status}.`);
        }

        const spec: unknown = await response.json();
        if (
          !isRecord(spec) ||
          typeof spec.openapi !== "string" ||
          !spec.paths ||
          typeof spec.paths !== "object"
        ) {
          throw new Error("The API documentation endpoint returned an invalid spec.");
        }

        setAccessState({ status: "allowed", spec });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load API documentation:", error);
          setAccessState({ status: "error" });
        }
      }
    }

    void loadApiDocs();
    return () => controller.abort();
  }, [retryCount, router]);

  if (accessState.status === "allowed") {
    return <SwaggerDocs spec={accessState.spec} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="max-w-lg text-center">
        {accessState.status === "checking" ? (
          <>
            <h1 className="text-2xl font-semibold">Checking access</h1>
            <p className="mt-2">Verifying your API documentation permissions...</p>
          </>
        ) : accessState.status === "forbidden" ? (
          <>
            <h1 className="text-2xl font-semibold">Access denied</h1>
            <p className="mt-2">
              API documentation is available to super administrators only.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Unable to load documentation</h1>
            <p className="mt-2">
              The API documentation could not be loaded. Please try again.
            </p>
            <button
              className="mt-4 rounded bg-black px-4 py-2 text-white"
              onClick={() => setRetryCount((count) => count + 1)}
              type="button"
            >
              Retry
            </button>
          </>
        )}
      </section>
    </main>
  );
}