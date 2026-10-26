"use client";

import { useEffect, useState } from "react";
import { Loader2, Shield, Trash2 } from "lucide-react";

type AdminRole = "SUPER_ADMIN" | "ADMIN";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

type SettingsResponse = {
  success: boolean;
  admins: AdminUser[];
  currentUserId: string;
  currentUserRole: AdminRole;
  message?: string;
};

export function SettingsView() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState<AdminRole>("ADMIN");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data: SettingsResponse = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Unable to load users.");
        return;
      }

      setUsers(data.admins);
      setCurrentUserId(data.currentUserId);
      setCurrentUserRole(data.currentUserRole);
    } catch {
      setError("Unable to load users right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, role: AdminRole) => {
    setSavingId(userId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Unable to update role.");
        return;
      }

      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
      setSuccess("Role updated successfully.");
    } catch {
      setError("Unable to update role right now.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Delete this admin user?")) {
      return;
    }

    setSavingId(userId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Unable to delete user.");
        return;
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSuccess("User deleted successfully.");
    } catch {
      setError("Unable to delete user right now.");
    } finally {
      setSavingId(null);
    }
  };

  const handleVerify = async (userId: string) => {
    setSavingId(userId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, action: "VERIFY" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Unable to verify user.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, emailVerified: true } : user))
      );
      setSuccess("User verified successfully.");
    } catch {
      setError("Unable to verify user right now.");
    } finally {
      setSavingId(null);
    }
  };

  if (currentUserRole !== "SUPER_ADMIN") {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Access Denied: You do not have Super Admin privileges.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="border border-[#222] bg-[#0d0d0d] p-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="border border-[#C9A84C]/30 bg-[#1a170e] p-3 text-[#C9A84C]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F5EDD6]">User Management</h2>
              <p className="text-sm text-muted-foreground">
                Manage admin access, assign roles, and remove users.
              </p>
            </div>
          </div>

          <div className="border border-[#222] bg-[#111] px-3 py-2 text-xs uppercase tracking-[0.25em] text-[#C9A84C]">
            {currentUserRole === "SUPER_ADMIN" ? "Super Admin Access" : "Admin Access"}
          </div>
        </div>
      </div>

      {error ? (
        <div className="border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="border border-[#C9A84C]/30 bg-[#1a170e]/50 p-3 text-sm text-[#F5EDD6]">
          {success}
        </div>
      ) : null}

      {currentUserRole !== "SUPER_ADMIN" ? (
        <div className="border border-[#222] bg-[#0d0d0d] p-4 text-sm text-muted-foreground">
          Only a super admin can manage other users.
        </div>
      ) : null}

      <div className="overflow-hidden border border-[#222] bg-[#0d0d0d]">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading users...
          </div>
        ) : (
          <div className="divide-y divide-[#222]">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const isBusy = savingId === user.id;

              return (
                <div
                  key={user.id}
                  className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#F5EDD6]">{user.name}</p>
                      {isCurrentUser ? (
                        <span className="border border-[#C9A84C]/30 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-[#C9A84C]">
                          You
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#666]">
                      Verified: {user.emailVerified ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user.id, e.target.value as AdminRole)}
                      disabled={isCurrentUser || currentUserRole !== "SUPER_ADMIN" || isBusy}
                      className="border border-[#333] bg-[#111] px-3 py-2 text-sm text-[#F5EDD6] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>

                    {!user.emailVerified ? (
                      <button
                        type="button"
                        onClick={() => handleVerify(user.id)}
                        disabled={currentUserRole !== "SUPER_ADMIN" || isBusy}
                        className="border border-[#C9A84C]/30 bg-[#1a170e] px-3 py-2 text-sm text-[#F5EDD6] transition hover:bg-[#221b0f] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : null}
                        Verify
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      disabled={isCurrentUser || currentUserRole !== "SUPER_ADMIN" || isBusy}
                      className="flex items-center justify-center gap-2 border border-red-900/40 bg-red-950/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
