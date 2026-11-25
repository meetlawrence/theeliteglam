"use client";

import { useEffect, useState } from "react";
import { Loader2, Shield, Trash2 } from "lucide-react";
import type { EventStatus } from "@/back-end/types/event-types";

type AdminRole = "SUPER_ADMIN" | "ADMIN";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permitted: boolean;
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

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

type EventDetails = EventStatus & {
  id: string;
  name: string;
};

const EVENT_CONTROLS: {
  key: keyof EventStatus;
  title: string;
  description: string;
}[] = [
  {
    key: "isRegistrationOpen",
    title: "Registration",
    description: "Open registration and allow new contestant applications.",
  },
  {
    key: "isContestantsVisible",
    title: "Contestants",
    description: "Show the contestants page to visitors.",
  },
  {
    key: "isVotingOpen",
    title: "Voting",
    description: "Allow visitors to vote for contestants.",
  },
  {
    key: "isTicketsOpen",
    title: "Event Tickets",
    description: "Show ticket options and allow event ticket purchases.",
  },
];

export function SettingsView() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingSettingKey, setSavingSettingKey] = useState<keyof EventStatus | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState<AdminRole | null>(null);
  const [event, setEvent] = useState<EventDetails | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [usersRes, firstEventRes] = await Promise.all([
        fetch("/api/admin/users", { cache: "no-store" }),
        fetch("/api/event/get-first-event", { cache: "no-store" }),
      ]);

      const data: SettingsResponse = await usersRes.json();

      if (!usersRes.ok || !data.success) {
        setError(data.message || "Unable to load directory.");
        return;
      }

      setUsers(data.admins);
      setCurrentUserId(data.currentUserId);
      setCurrentUserRole(data.currentUserRole);

      const firstEventData: ApiResponse<{ id: string }> = await firstEventRes.json();
      if (!firstEventRes.ok || !firstEventData.success || !firstEventData.data?.id) {
        setError(firstEventData.message || "Unable to load event settings.");
        return;
      }

      const eventRes = await fetch(
        `/api/event/get-event-by-id?id=${encodeURIComponent(firstEventData.data.id)}`,
        { cache: "no-store" },
      );
      const eventData: ApiResponse<EventDetails> = await eventRes.json();
      if (!eventRes.ok || !eventData.success || !eventData.data) {
        setError(eventData.message || "Unable to load event settings.");
        return;
      }

      setEvent(eventData.data);
    } catch {
      setError("Unable to load system data right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
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

  const handlePermit = async (userId: string) => {
    setSavingId(userId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, action: "PERMIT" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Unable to permit user.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, permitted: true } : user))
      );
      setSuccess("User permitted successfully.");
    } catch {
      setError("Unable to permit user right now.");
    } finally {
      setSavingId(null);
    }
  };

  const handleSettingUpdate = async (key: keyof EventStatus, value: boolean) => {
    if (!event) {
      setError("Event settings are unavailable.");
      return;
    }

    setSavingSettingKey(key);
    setError("");
    setSuccess("");

    const payload: Partial<EventStatus> = { [key]: value };

    try {
      const res = await fetch(
        `/api/event/patch-event?id=${encodeURIComponent(event.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data: ApiResponse<EventDetails> = await res.json();
      if (!res.ok || !data.success || !data.data) {
        setError(data.message || "Unable to update system setting.");
        return;
      }

      setEvent(data.data);
      setSuccess("System settings updated successfully.");
    } catch {
      setError("Unable to update system setting right now.");
    } finally {
      setSavingSettingKey(null);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 p-8 text-sm text-[#8A806C]">
        <Loader2 className="h-5 w-5 animate-spin text-[#C9A84C]" />
        <span>Loading system settings...</span>
      </div>
    );
  }

  if (currentUserRole !== "SUPER_ADMIN") {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {currentUserRole === null
          ? error || "Unable to verify administrator access."
          : "Access Denied: You do not have Super Admin privileges."}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-10">
      <header className="flex flex-col justify-between gap-4 border-b border-[#1E1E1E] pb-6 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[0.85rem] font-medium uppercase text-[#C9A84C]">
            <Shield className="h-3.5 w-3.5" />
            <span>Access Control & Operations</span>
          </div>
          <h2 className="font-['Cinzel',serif] text-2xl tracking-wide text-[#F5EDD6]">
            System Management
          </h2>
          <p className="text-sm text-[#8A806C]">
            Manage event phases, registration, voting availability, ticketing, and admin access.
          </p>
        </div>
      </header>

      {error ? (
        <div className="flex items-center justify-between border-l-2 border-[#C96B5D] bg-[#160D0C] px-4 py-3 text-sm text-[#E5988D]">
          <span>{error}</span>
        </div>
      ) : null}

      {success ? (
        <div className="flex items-center justify-between border-l-2 border-[#C9A84C] bg-[#14120B] px-4 py-3 text-sm text-[#F5EDD6]">
          <span>{success}</span>
        </div>
      ) : null}

      <div className="space-y-4">
        <h3 className="font-['Cinzel',serif] text-lg tracking-wide text-[#F5EDD6]">
          Event Controls
        </h3>
        
        {event ? (
          <div className="space-y-4">
            <p className="text-sm text-[#8A806C]">Settings for {event.name}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {EVENT_CONTROLS.map(({ key, title, description }) => {
                const isOpen = event[key];
                const isSaving = savingSettingKey === key;

                return (
                  <div
                    key={key}
                    className="flex flex-col justify-between rounded-xl border border-[#1E1E1E] bg-[#0D0D0D] p-5 shadow-lg transition-colors hover:border-[#2a2a2a]"
                  >
                    <div className="space-y-1.5">
                      <h4 className="mb-3 font-cinzel text-[1.1rem] leading-[1.3] tracking-wider text-[#C9A84C]">
                        {title}
                      </h4>
                      <p className="font-raleway text-[0.9rem] leading-[1.7] text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-[#1A1A1A] pt-4">
                      <span className="text-xs text-[#8A806C]">
                        {isOpen ? "Enabled" : "Disabled"}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-label={`${title} ${isOpen ? "enabled" : "disabled"}`}
                        aria-checked={isOpen}
                        onClick={() => handleSettingUpdate(key, !isOpen)}
                        disabled={savingSettingKey !== null}
                        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-[#2A2A2A] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 focus:ring-offset-2 focus:ring-offset-[#0D0D0D] disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          backgroundColor: isOpen ? "#C9A84C" : "#181818",
                        }}
                      >
                        {isSaving ? (
                          <Loader2 className="absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 animate-spin text-[#F5EDD6]" />
                        ) : (
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200 ${
                              isOpen
                                ? "translate-x-6 bg-[#0A0A0A]"
                                : "translate-x-1 bg-[#8A806C]"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="border-l-2 border-[#C96B5D] bg-[#160D0C] px-4 py-3 text-sm text-[#E5988D]">
            Event settings are unavailable because no event could be loaded.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-['Cinzel',serif] text-lg tracking-wide text-[#F5EDD6]">
          Administrator Directory
        </h3>

        <div className="bg-[#0A0A0A] rounded-lg">
          <div className="hidden grid-cols-12 border-b border-[#1E1E1E] bg-[#0E0E0E] px-6 py-3 text-[0.85rem] font-medium uppercase text-[#6E6656] md:grid">
            <div className="col-span-5">Administrator</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-4 text-right">Role & Actions</div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-sm text-[#8A806C]">
              <Loader2 className="h-5 w-5 animate-spin text-[#C9A84C]" />
              <span className="tracking-wide">Loading directory...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#6E6656]">
              No administrators found.
            </div>
          ) : (
            <div className="divide-y divide-[#1A1A1A]">
              {users.map((user) => {
                const isCurrentUser = user.id === currentUserId;
                const isBusy = savingId === user.id;

                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-1 items-center gap-4 px-6 py-4 transition-colors hover:bg-[#0F0F0F] md:grid-cols-12"
                  >
                    <div className="col-span-5 flex items-center gap-3.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-[#F5EDD6]">
                            {user.name}
                          </p>
                          {isCurrentUser ? (
                            <span className="bg-[#C9A84C]/15 px-1.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-[#C9A84C]">
                              You
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-[#7A7262]">{user.email}</p>
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center">
                      {user.permitted ? (
                        <span className="inline-flex items-center gap-2 text-xs text-emerald-500/80">
                          Permitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 px-2.5 py-0.5 text-[0.68rem] uppercase text-amber-300/90">
                          Pending Approval
                        </span>
                      )}
                    </div>

                    <div className="col-span-4 flex flex-wrap items-center justify-start gap-2.5 md:justify-end">
                      {!user.permitted ? (
                        <button
                          type="button"
                          onClick={() => handlePermit(user.id)}
                          disabled={currentUserRole !== "SUPER_ADMIN" || isBusy}
                          className="inline-flex items-center gap-1.5 border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-1.5 text-xs font-medium tracking-wide text-[#F5EDD6] transition hover:bg-[#C9A84C] hover:text-[#080808] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isBusy ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : null}
                          Approve
                        </button>
                      ) : null}

                      <select
                        aria-label={`Role for ${user.name}`}
                        value={user.role}
                        onChange={(e) =>
                          handleRoleUpdate(user.id, e.target.value as AdminRole)
                        }
                        disabled={
                          isCurrentUser || currentUserRole !== "SUPER_ADMIN" || isBusy
                        }
                        className="h-8 border border-[#262626] bg-[#111111] px-2.5 text-xs text-[#E5DEC9] transition focus:border-[#C9A84C]/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 "
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>

                      <button
                        type="button"
                        title="Remove administrator"
                        aria-label={`Delete ${user.name}`}
                        onClick={() => handleDelete(user.id)}
                        disabled={
                          isCurrentUser || currentUserRole !== "SUPER_ADMIN" || isBusy
                        }
                        className="flex h-8 w-8 items-center justify-center border border-transparent text-[#6E6656] transition hover:border-red-900/40 hover:bg-red-950/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        {isBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}