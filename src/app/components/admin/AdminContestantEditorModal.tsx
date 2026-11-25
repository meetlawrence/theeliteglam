"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { Contestant } from "./AdminDashboardTypes";

type ContestantDraft = Omit<Contestant, "id" | "status">;
type ContestantUpdate = Partial<Omit<Contestant, "id">>;

interface AdminContestantEditorModalProps {
  open: boolean;
  contestantId: string | null;
  onClose: () => void;
  onContestantUpdated?: (contestant: Contestant) => void;
}

const fieldClass =
  "w-full rounded bg-[#141414] px-3 py-2 text-base sm:text-sm text-[#F5EDD6] outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#C9A84C]";
const labelClass = "mb-1.5 block text-xs text-neutral-400";

function cmToFeetInches(cm: number | null | undefined): {
  feet: string;
  inches: string;
} {
  if (!cm || cm <= 0) return { feet: "", inches: "" };
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet: String(feet), inches: String(inches) };
}

function feetInchesToCm(feetStr: string, inchesStr: string): number | null {
  const hasFeet = feetStr.trim() !== "";
  const hasInches = inchesStr.trim() !== "";
  if (!hasFeet && !hasInches) return null;

  const feet = hasFeet ? Math.max(0, Number(feetStr)) : 0;
  const inches = hasInches ? Math.max(0, Number(inchesStr)) : 0;
  if (Number.isNaN(feet) || Number.isNaN(inches)) return null;

  const totalInches = feet * 12 + inches;
  if (totalInches <= 0) return null;
  return Math.round(totalInches * 2.54);
}

function toDraft(contestant: Contestant): ContestantDraft {
  return {
    name: contestant.name,
    email: contestant.email,
    phone: contestant.phone ?? "",
    image: contestant.image ?? "",
    gender: contestant.gender,
    age: contestant.age,
    state: contestant.state,
    country: contestant.country ?? "",
    tribe: contestant.tribe ?? "",
    occupation: contestant.occupation ?? "",
    height: contestant.height ?? null,
    weight: contestant.weight ?? null,
    portfolio: contestant.portfolio ?? "",
    advocacy: contestant.advocacy ?? "",
    funFact: contestant.funFact ?? "",
    bio: contestant.bio ?? "",
    stageName: contestant.stageName ?? "",
    contestantCategories: contestant.contestantCategories,
  };
}

export function AdminContestantEditorModal({
  open,
  contestantId,
  onClose,
  onContestantUpdated,
}: AdminContestantEditorModalProps) {
  const [contestant, setContestant] = useState<Contestant | null>(null);
  const [draft, setDraft] = useState<ContestantDraft | null>(null);
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !contestantId) return;

    const controller = new AbortController();
    const loadContestant = async () => {
      setIsLoading(true);
      setContestant(null);
      setDraft(null);
      setHeightFeet("");
      setHeightInches("");
      setError("");
      setNotice("");

      try {
        const response = await fetch(
          `/api/contestants/get-contestant-by-id?id=${encodeURIComponent(contestantId)}`,
          { cache: "no-store", signal: controller.signal },
        );
        const result = await response.json();
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message || "Contestant record not found.");
        }

        const record = result.data as Contestant;
        const { feet, inches } = cmToFeetInches(record.height);
        setContestant(record);
        setDraft(toDraft(record));
        setHeightFeet(feet);
        setHeightInches(inches);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError")
          return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load contestant.",
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void loadContestant();
    return () => controller.abort();
  }, [open, contestantId]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving && !isUploadingImage) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isSaving, isUploadingImage, onClose]);

  const updateContestant = async (changes: ContestantUpdate) => {
    if (!contestantId || !contestant || !draft) return;
    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/contestants/patch-contestant?id=${encodeURIComponent(contestantId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        },
      );
      const result = await response.json();
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.message || "Unable to save contestant changes.");
      }

      const updated = result.data as Contestant;
      const { feet, inches } = cmToFeetInches(updated.height);
      setContestant(updated);
      setDraft(toDraft(updated));
      setHeightFeet(feet);
      setHeightInches(inches);
      onContestantUpdated?.(updated);
      setNotice("Saved.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save contestant changes.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError("Choose an image no larger than 5 MB.");
      return;
    }

    setIsUploadingImage(true);
    setError("");
    setNotice("");
    try {
      const formData = new FormData();
      formData.set("image", file);
      const response = await fetch("/api/contestants/upload-image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.imageUrl) {
        throw new Error(result.message || "Unable to upload image.");
      }
      await updateContestant({ image: result.data.imageUrl });
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image.",
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const buildUpdate = (status?: Contestant["status"]): ContestantUpdate => {
    if (!draft) return {};
    return {
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone?.trim() || null,
      gender: draft.gender,
      image: draft.image?.trim() || null,
      stageName: draft.stageName?.trim() || null,
      age: draft.age,
      state: draft.state.trim(),
      country: draft.country?.trim(),
      tribe: draft.tribe?.trim(),
      occupation: draft.occupation?.trim(),
      height: draft.height || null,
      weight: draft.weight || null,
      portfolio: draft.portfolio?.trim() || null,
      advocacy: draft.advocacy?.trim(),
      funFact: draft.funFact?.trim(),
      bio: draft.bio?.trim() || null,
      contestantCategories: draft.contestantCategories,
      ...(status ? { status } : {}),
    };
  };

  if (!open) return null;

  const setField = <K extends keyof ContestantDraft>(
    field: K,
    value: ContestantDraft[K],
  ) => setDraft((current) => (current ? { ...current, [field]: value } : current));

  const handleHeightChange = (nextFeet: string, nextInches: string) => {
    setHeightFeet(nextFeet);
    setHeightInches(nextInches);
    setField("height", feetInchesToCm(nextFeet, nextInches));
  };

  const renderInput = (
    label: string,
    field: Exclude<keyof ContestantDraft, "height">,
    type = "text",
  ) => (
    <label className="block" key={field}>
      <span className={labelClass}>{label}</span>
      <input
        type={type}
        value={String(draft?.[field] ?? "")}
        onChange={(event) => {
          const value = event.target.value;
          if (field === "age" || field === "weight") {
            setField(
              field,
              (value ? Number(value) : null) as ContestantDraft[typeof field],
            );
          } else {
            setField(field, value as ContestantDraft[typeof field]);
          }
        }}
        className={fieldClass}
      />
    </label>
  );

  const renderTextarea = (
    label: string,
    field: "advocacy" | "funFact" | "bio",
  ) => (
    <label className="block" key={field}>
      <span className={labelClass}>{label}</span>
      <textarea
        rows={3}
        value={draft?.[field] ?? ""}
        onChange={(event) => setField(field, event.target.value)}
        className={`${fieldClass} resize-y`}
      />
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving && !isUploadingImage)
          onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contestant-editor-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-[#0E0E0E] p-6 text-[#F5EDD6] ring-1 ring-white/10"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {draft?.image ? (
              <img
                src={draft.image}
                alt={draft.name}
                className="h-11 w-11 rounded-full object-cover object-top"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-sm text-[#C9A84C]">
                {draft?.name.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isSaving || isUploadingImage}
              className="rounded px-3 py-1.5 text-xs text-neutral-300 ring-1 ring-white/15 hover:bg-white/5 disabled:opacity-50"
            >
              {isUploadingImage ? "Uploading..." : "Change Photo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isUploadingImage}
              className="rounded px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/5 hover:text-white disabled:opacity-50"
            >
              Close
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-sm text-neutral-400">
            Loading...
          </p>
        ) : draft ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {renderInput("Full Name", "name")}
              {renderInput("Stage Name", "stageName")}
              {renderInput("Email", "email", "email")}
              {renderInput("Phone", "phone", "tel")}
              {renderInput("Age", "age", "number")}
              {renderInput("State", "state")}
              {renderInput("Country", "country")}
              {renderInput("Tribe", "tribe")}
              {renderInput("Occupation", "occupation")}

              <div className="block">
                <span className={labelClass}>Height (ft / in)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={0}
                    max={9}
                    placeholder="ft"
                    aria-label="Height in feet"
                    value={heightFeet}
                    onChange={(event) =>
                      handleHeightChange(event.target.value, heightInches)
                    }
                    className={fieldClass}
                  />
                  <input
                    type="number"
                    min={0}
                    max={11}
                    placeholder="in"
                    aria-label="Height in inches"
                    value={heightInches}
                    onChange={(event) =>
                      handleHeightChange(heightFeet, event.target.value)
                    }
                    className={fieldClass}
                  />
                </div>
              </div>

              {renderInput("Weight (kg)", "weight", "number")}
              {renderInput("Social Handle", "portfolio", "url")}

              <label className="block">
                <span className={labelClass}>Gender</span>
                <select
                  value={draft.gender}
                  onChange={(event) => setField("gender", event.target.value)}
                  className={fieldClass}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </label>
            </div>

            {renderTextarea("Advocacy", "advocacy")}
            {renderTextarea("Fun Fact", "funFact")}
            {renderTextarea("Bio", "bio")}
          </div>
        ) : (
          <p role="alert" className="py-8 text-center text-sm text-red-400">
            {error || "Unable to load contestant."}
          </p>
        )}

        {error && draft && (
          <p role="alert" className="mt-4 text-xs text-red-400">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 text-xs text-emerald-400">
            {notice}
          </p>
        )}

        {draft && contestant && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => void updateContestant({ status: "INACTIVE" })}
              disabled={isSaving || isUploadingImage}
              className="rounded px-3.5 py-2 text-xs text-red-400 hover:bg-red-950/40 disabled:opacity-50"
            >
              Set Inactive
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void updateContestant(buildUpdate())}
                disabled={isSaving || isUploadingImage}
                className="rounded px-4 py-2 text-xs text-[#F5EDD6] ring-1 ring-white/15 hover:bg-white/5 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => void updateContestant(buildUpdate("ACTIVE"))}
                disabled={
                  isSaving || isUploadingImage || contestant.status === "ACTIVE"
                }
                className="rounded bg-[#C9A84C] px-4 py-2 text-xs font-medium text-black hover:opacity-90 disabled:opacity-50"
              >
                {contestant.status === "ACTIVE" ? "Approved" : "Approve"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}