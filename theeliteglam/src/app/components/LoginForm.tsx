"use client";

import { useRouter } from "next/navigation";
import { AdminInput } from "./ui/AdminInput";

export function LoginForm() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/dashboard");
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#080808] border border-[rgba(201,168,76,0.1)] p-10 shadow-2xl">
      <h2 className="font-serif text-2xl text-[#F5EDD6] mb-8 text-center tracking-widest uppercase">Admin Login</h2>
      <div className="flex flex-col gap-6 mb-8">
        <AdminInput label="Username" placeholder="Enter admin ID" />
        <AdminInput label="Password" type="password" placeholder="••••••••" />
      </div>
      <button className="w-full bg-[#C9A84C] text-[#080808] py-3 font-bold tracking-widest uppercase text-sm hover:bg-[#F0C04A] transition-colors">
        Enter Dashboard
      </button>
    </form>
  );
}