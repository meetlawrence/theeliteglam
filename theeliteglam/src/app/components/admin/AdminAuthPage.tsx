"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import AdminAuthField from "./AdminAuthField";
import AdminAuthFooter from "./AdminAuthFooter";
import AdminAuthHeader from "./AdminAuthHeader";
import AdminAuthTabs, { type AdminTab } from "./AdminAuthTabs";

export default function AdminAuthPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("create");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCreateMode = activeTab === "create";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setIsSubmitting(true);

    const endpoint = isCreateMode ? "/api/auth/signup" : "/api/auth/login";
    const payload = isCreateMode
      ? { name: fullName, email, password, confirmPassword }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Authentication failed.");
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch {
      setServerError("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.18),transparent_55%)]" />

      <div
        className={`absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-1500 ${
          isSubmitting ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-140 w-full max-w-130 items-center justify-center border border-[#222] bg-[#101010]/95 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.85)] backdrop-blur-sm">
          <div className="relative h-14 w-14 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
        </div>
      </div>

      <div
        className={`relative z-10 flex min-h-screen items-center justify-center transition-all duration-700 ${
          isSubmitting ? "scale-[0.98] opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="w-full max-w-130 border border-[#222] bg-[#101010]/95 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.75)] transition-all duration-300 ease-out backdrop-blur-sm">
          <div className="transition-all duration-300 ease-out">
            <AdminAuthHeader
              title={isCreateMode ? "Create Account" : "Admin Login"}
              description={
                isCreateMode
                  ? "Create your admin account to securely access the dashboard."
                  : "Please enter your credentials to access the dashboard."
              }
            />
          </div>

          <AdminAuthTabs activeTab={activeTab} onChange={setActiveTab} />

          <form
            onSubmit={handleSubmit}
            className="space-y-4 px-8 transition-all duration-300 ease-out"
          >
            <div
              className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
                isCreateMode
                  ? "max-h-40 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <AdminAuthField
                id="admin-name"
                label="Full Name"
                name="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                type="text"
                icon={User}
                labelClassName="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground"
              />
            </div>

            <AdminAuthField
              id="admin-email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              icon={Mail}
              labelClassName="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground"
            />

            <div className="transition-all duration-300 ease-out">
              <div className="mb-2 flex justify-between">
                <label
                  htmlFor="admin-password"
                  className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Password
                </label>
                {activeTab === "login" ? (
                  <span className="cursor-pointer text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground hover:text-[#C9A84C]">
                    Forgot?
                  </span>
                ) : null}
              </div>

              <AdminAuthField
                id="admin-password"
                label=""
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isCreateMode ? "Create a password" : "Enter your password"}
                type={showPassword ? "text" : "password"}
                icon={Lock}
                rightSlot={
                  <button type="button" onClick={() => setShowPassword((value) => !value)}>
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#666]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#666]" />
                    )}
                  </button>
                }
              />
            </div>

            <div
              className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
                isCreateMode
                  ? "max-h-40 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="pb-4">
                <AdminAuthField
                  id="admin-password-confirm"
                  label="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  labelClassName="text-[0.6rem] uppercase tracking-[0.2em] text-[#9A8C6A]"
                />
              </div>
            </div>

            {serverError ? (
              <p className="text-sm text-red-400 transition-opacity duration-300 ease-out">
                {serverError}
              </p>
            ) : null}

            <button className="w-full bg-[#C9A84C] py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#080808] transition-all duration-300 ease-out hover:bg-accent">
              {isCreateMode ? "Create Account" : "Sign In"}
            </button>
          </form>

          <AdminAuthFooter />
        </div>
      </div>
    </main>
  );
}
