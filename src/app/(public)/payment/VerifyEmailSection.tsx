"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function VerifyEmailSection() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const result = await res.json();

        if (result.success) {
          setStatus("success");
          setMessage("✅ Your email has been successfully verified!");
        } else {
          setStatus("error");
          setMessage(result.error || "Verification failed.");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <main className="auth-page min-vh-100 d-flex align-items-center justify-content-center bg-black">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card bg-dark border-0 shadow-lg rounded-4">
              <div className="card-body p-5 text-center">
                {status === "loading" && (
                  <>
                    <div
                      className="spinner-border text-warning mb-4"
                      style={{ width: "4rem", height: "4rem" }}
                    />
                    <h2 className="text-white mb-3">Verifying your email...</h2>
                    <p className="text-muted">Please wait while we confirm your account.</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <div className="display-1 mb-4">🎉</div>
                    <h2 className="text-success mb-4">Email Verified Successfully!</h2>
                    <p className="text-light mb-5">{message}</p>
                    <Link href="/login" className="btn btn-warning btn-lg px-5">
                      Go to Login
                    </Link>
                  </>
                )}

                {status === "error" && (
                  <>
                    <div className="display-1 mb-4">❌</div>
                    <h2 className="text-danger mb-4">Verification Failed</h2>
                    <p className="text-light mb-5">{message}</p>
                    <Link href="/signup" className="btn btn-outline-light btn-lg px-5">
                      Try Signing Up Again
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
