"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminButton } from "./AdminButton";
import type { Contestant } from "@/app/components/contestants/types";

export default function AdminContestantModal({
  contestant,
  open,
  onClose,
  onSave,
  onDelete,
  status,
  onMarkFinalist,
  onRestore,
}: {
  contestant: Contestant | null;
  open: boolean;
  onClose: () => void;
  onSave: (c: Contestant) => void;
  onDelete: (id: number) => void;
  status?: "active" | "finalist" | "eliminated";
  onMarkFinalist?: (id: number) => void;
  onRestore?: (id: number) => void;
}) {
  const [form, setForm] = useState<Contestant | null>(contestant);

  useEffect(() => {
    setForm(contestant ? { ...contestant } : null);
  }, [contestant]);

  if (!open || !form) return null;

  const handleChange = (k: keyof Contestant, v: any) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 700,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 760,
          background: "#0E0E0E",
          border: "1px solid rgba(201,168,76,0.15)",
          padding: 18,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <div
            style={{
              width: 56,
              height: 56,
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(201,168,76,0.18)",
            }}
          >
            <Image src={form.image} alt={form.name} fill className="object-cover object-top" />
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel', serif", color: "#F5EDD6", fontSize: 16 }}>
              {form.name}
            </div>
            <div style={{ color: "#C9A84C", fontSize: 12 }}>
              {form.number} · {form.state}
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {status !== "finalist" ? (
              <AdminButton
                label="Mark Finalist"
                variant="ghost"
                onClick={() => onMarkFinalist && onMarkFinalist(form.id)}
              />
            ) : (
              <AdminButton
                label="Remove Finalist"
                variant="secondary"
                onClick={() => onRestore && onRestore(form.id)}
              />
            )}

            {status !== "eliminated" ? (
              <AdminButton label="Eliminate" variant="danger" onClick={() => onDelete(form.id)} />
            ) : (
              <AdminButton
                label="Restore"
                variant="ghost"
                onClick={() => onRestore && onRestore(form.id)}
              />
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label className="text-xs text-[#9A8C6A]">Full name</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full mt-1 p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
            />

            <label className="text-xs text-[#9A8C6A] mt-3 block">Number</label>
            <input
              value={form.number}
              onChange={(e) => handleChange("number", e.target.value)}
              className="w-full mt-1 p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
            />

            <label className="text-xs text-[#9A8C6A] mt-3 block">State</label>
            <input
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="w-full mt-1 p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
            />
          </div>

          <div>
            <label className="text-xs text-[#9A8C6A]">Occupation</label>
            <input
              value={form.occupation}
              onChange={(e) => handleChange("occupation", e.target.value)}
              className="w-full mt-1 p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
            />

            <label className="text-xs text-[#9A8C6A] mt-3 block">Age</label>
            <input
              type="number"
              value={form.age}
              onChange={(e) => handleChange("age", Number(e.target.value))}
              className="w-full mt-1 p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
            />

            <label className="text-xs text-[#9A8C6A] mt-3 block">Tribe</label>
            <input
              value={form.tribe}
              onChange={(e) => handleChange("tribe", e.target.value)}
              className="w-full mt-1 p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
            />
          </div>
        </div>

        <label className="text-xs text-[#9A8C6A] mt-3 block">Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          rows={4}
          className="w-full mt-1 p-2 bg-[#0D0D0D] border border-[#1a170e] text-[#F5EDD6]"
        />

        <div className="flex gap-2 mt-4">
          <AdminButton
            label="Save"
            variant="filled"
            onClick={() => {
              onSave(form);
              onClose();
            }}
          />
          <AdminButton label="Cancel" variant="ghost" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}
