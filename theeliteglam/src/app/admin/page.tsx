"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function AdminLoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "create">("create");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#080808] px-4">
      <div className="w-full max-w-130 border border-[#222] bg-[#101010]/95 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.75)] transition-all duration-300 ease-out backdrop-blur-sm">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="font-raleway text-4xl text-[#F5EDD6] mb-3">
            {activeTab === "create" ? "Create Account" : "Admin Login"}
          </h1>
          <p className="text-[#9A8C6A] text-sm">
            {activeTab === "create"
              ? "Create your admin account to securely access the dashboard."
              : "Please enter your credentials to access the portal."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#222] mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase transition-colors ${
              activeTab === "login" ? "text-[#F5EDD6] border-b-2 border-[#C9A84C]" : "text-[#444] hover:text-[#9A8C6A]"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase transition-colors ${
              activeTab === "create" ? "text-[#F5EDD6] border-b-2 border-[#C9A84C]" : "text-[#444] hover:text-[#9A8C6A]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-8 transition-all duration-300 ease-out">
          <div className={`transition-all duration-300 ease-out overflow-hidden ${activeTab === 'create' ? 'max-h-[1000px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'}`}>
            <div>
              <label htmlFor="admin-name" className="block text-[0.6rem] uppercase tracking-[0.2em] text-[#9A8C6A] mb-2">
                Full Name
              </label>
              <div className="relative flex items-center bg-[#111] border border-[#222] px-4 py-3">
                <User className="text-[#444] w-4 h-4 mr-3" />
                <input
                  id="admin-name"
                  name="name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="bg-transparent w-full text-[#F5EDD6] outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="admin-email" className="block text-[0.6rem] uppercase tracking-[0.2em] text-[#9A8C6A] mb-2">Email Address</label>
            <div className="relative flex items-center bg-[#111] border border-[#222] px-4 py-3">
              <Mail className="text-[#444] w-4 h-4 mr-3" />
              <input
                id="admin-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@eliteglam.com"
                className="bg-transparent w-full text-[#F5EDD6] outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="admin-password" className="text-[0.6rem] uppercase tracking-[0.2em] text-[#9A8C6A]">Password</label>
              {activeTab === "login" ? (
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#9A8C6A] cursor-pointer hover:text-[#C9A84C]">Forgot?</span>
              ) : null}
            </div>
            <div className="relative flex items-center bg-[#111] border border-[#222] px-4 py-3">
              <Lock className="text-[#444] w-4 h-4 mr-3" />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={activeTab === "create" ? "Create a password" : "Enter your password"}
                className="bg-transparent w-full text-[#F5EDD6] outline-none text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="text-[#666] w-4 h-4" /> : <Eye className="text-[#666] w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className={`transition-all duration-300 ease-out overflow-hidden ${
            activeTab === "create" ? "max-h-[1200px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
          }`}>
            <div className="pb-4">
              <label htmlFor="admin-password-confirm" className="block text-[0.6rem] uppercase tracking-[0.2em] text-[#9A8C6A] mb-2">Confirm Password</label>
              <div className="relative flex items-center bg-[#111] border border-[#222] px-4 py-3">
                <Lock className="text-[#444] w-4 h-4 mr-3" />
                <input
                  id="admin-password-confirm"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="bg-transparent w-full text-[#F5EDD6] outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-[#C9A84C] text-[#080808] py-3 font-bold tracking-[0.2em] uppercase text-sm hover:bg-[#F0C04A] transition-all">
            {activeTab === "create" ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <span className="bg-[#080808] px-4 text-[0.6rem] uppercase tracking-[0.2em] text-[#444]">Secure access only</span>
          </div>
        </div>
      </div>
    </main>
  );
}