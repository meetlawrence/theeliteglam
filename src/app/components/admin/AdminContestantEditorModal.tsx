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

const inputClass =
  "w-full bg-[#0D0D0D] border border-[rgba(201,168,76,0.2)] px-3.5 py-2.5 text-[#F5EDD6] text-xs outline-none focus:border-[#C9A84C] transition-colors";
const labelClass =
  "text-[#9A8C6A] block text-[10px] uppercase tracking-wider mb-1 font-raleway";

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
      setError("");
      setNotice("");

      try {
        const response = await fetch(
          `/api/contestants/get-contestant-by-id?id=${encodeURIComponent(contestantId)}`,
          { cache: "no-store", signal: controller.signal },
        );
        const result = await response.json();
        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.error || result.message || "Contestant record not found.",
          );
        }

        const record = result.data as Contestant;
        setContestant(record);
        setDraft(toDraft(record));
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
        throw new Error(
          result.error || result.message || "Unable to save contestant changes.",
        );
      }

      const updated = result.data as Contestant;
      setContestant(updated);
      setDraft(toDraft(updated));
      onContestantUpdated?.(updated);
      setNotice("Contestant details saved.");
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
        throw new Error(result.error || result.message || "Unable to upload image.");
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
      phone: draft.phone?.trim() || undefined,
      gender: draft.gender,
      image: draft.image?.trim() || null,
      stageName: draft.stageName?.trim() || null,
      age: draft.age,
      state: draft.state.trim(),
      country: draft.country?.trim() || undefined,
      tribe: draft.tribe?.trim() || undefined,
      occupation: draft.occupation?.trim() || undefined,
      height: draft.height || null,
      weight: draft.weight || null,
      portfolio: draft.portfolio?.trim() || null,
      advocacy: draft.advocacy?.trim() || undefined,
      funFact: draft.funFact?.trim() || undefined,
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

  const textField = (
    label: string,
    field: keyof ContestantDraft,
    type = "text",
  ) => (
    <label className="block" key={field}>
      <span className={labelClass}>{label}</span>
      <input
        type={type}
        value={String(draft?.[field] ?? "")}
        onChange={(event) => {
          const value = event.target.value;
          if (field === "age" || field === "height" || field === "weight") {
            setField(
              field,
              (value ? Number(value) : null) as ContestantDraft[typeof field],
            );
          } else {
            setField(field, value as ContestantDraft[typeof field]);
          }
        }}
        className={inputClass}
      />
    </label>
  );

  const textArea = (label: string, field: "advocacy" | "funFact" | "bio") => (
    <label className="block" key={field}>
      <span className={labelClass}>{label}</span>
      <textarea
        rows={3}
        value={draft?.[field] ?? ""}
        onChange={(event) => setField(field, event.target.value)}
        className={inputClass}
      />
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving && !isUploadingImage)
          onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contestant-editor-title"
        className="max-h-[94vh] w-full max-w-4xl overflow-y-auto border border-[rgba(201,168,76,0.35)] bg-[#161616] p-5 text-[#F5EDD6] shadow-2xl sm:p-8"
      >
        <header className="mb-6 flex items-center justify-between gap-4 border-b border-[rgba(201,168,76,0.2)] pb-4">
          <div className="flex items-center gap-4">
            {draft?.image ? (
              <img
                src={draft.image}
                alt=""
                className="h-14 w-14 rounded-full border border-[#C9A84C] object-cover object-top"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A84C] bg-[rgba(201,168,76,0.08)] font-cinzel text-xl text-[#C9A84C]">
                {draft?.name.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
            <div>
              <span className="block font-cinzel text-[0.65rem] uppercase tracking-widest text-[#C9A84C]">
                Contestant Profile
              </span>
              <h2 id="contestant-editor-title" className="font-cinzel text-xl">
                {draft?.name || "Edit contestant"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close contestant editor"
            onClick={onClose}
            disabled={isSaving || isUploadingImage}
            className="border border-[rgba(201,168,76,0.2)] px-3 py-2 text-xs text-[#C9A84C] disabled:opacity-50"
          >
            Close
          </button>
        </header>

        {isLoading ? (
          <p className="py-12 text-center font-raleway text-sm text-[#C4B896]">
            Loading contestant profile...
          </p>
        ) : draft ? (
          <div className="space-y-6">
            <section>
              <h3 className="mb-3 border-b border-[rgba(201,168,76,0.15)] pb-1 font-cinzel text-xs uppercase tracking-widest text-[#C9A84C]">
                Personal &amp; Demographic Details
              </h3>
              <div className="grid grid-cols-1 gap-4 font-raleway text-xs sm:grid-cols-2 lg:grid-cols-3">
                {textField("Full Name", "name")}
                {textField("Stage Name", "stageName")}
                {textField("Email Address", "email", "email")}
                {textField("Phone Number", "phone", "tel")}
                {textField("Age", "age", "number")}
                {textField("State", "state")}
                {textField("Country", "country")}
                {textField("Tribe", "tribe")}
                {textField("Occupation", "occupation")}
                {textField("Height (cm)", "height", "number")}
                {textField("Weight (kg)", "weight", "number")}
                {textField("Portfolio URL", "portfolio", "url")}
                {(["gender", "contestantCategories"] as const).map((field) => (
                  <label className="block" key={field}>
                    <span className={labelClass}>
                      {field === "gender" ? "Gender" : "Contestant Category"}
                    </span>
                    <select
                      value={draft[field]}
                      onChange={(event) =>
                        setField(field, event.target.value)
                      }
                      className={inputClass}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 border-b border-[rgba(201,168,76,0.15)] pb-1 font-cinzel text-xs uppercase tracking-widest text-[#C9A84C]">
                Profile Media
              </h3>
              <div className="flex flex-col justify-between gap-4 border border-[rgba(201,168,76,0.15)] bg-[#171717] p-4 sm:flex-row sm:items-center">
                <p className="font-raleway text-[11px] text-[#9A8C6A]">
                  Upload a JPG, PNG or WebP image (max 5 MB).
                </p>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isSaving || isUploadingImage}
                  className="border border-[rgba(201,168,76,0.4)] px-4 py-2.5 text-xs uppercase tracking-wider text-[#C9A84C] disabled:opacity-50"
                >
                  {isUploadingImage ? "Uploading..." : "Upload New Image"}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 border-b border-[rgba(201,168,76,0.15)] pb-1 font-cinzel text-xs uppercase tracking-widest text-[#C9A84C]">
                Statements &amp; Background
              </h3>
              <div className="space-y-4">
                {textArea("Advocacy Statement", "advocacy")}
                {textArea("Fun Fact", "funFact")}
                {textArea("Biography", "bio")}
              </div>
            </section>
          </div>
        ) : (
          <p role="alert" className="py-8 text-center font-raleway text-sm text-red-400">
            {error || "Unable to load contestant."}
          </p>
        )}

        {error && draft && (
          <p role="alert" className="mt-5 border border-red-900/50 bg-red-950/40 p-3.5 font-raleway text-xs text-red-400">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-5 border border-emerald-900/50 bg-emerald-950/30 p-3.5 font-raleway text-xs text-emerald-400">
            {notice}
          </p>
        )}

        {draft && contestant && (
          <footer className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-[rgba(201,168,76,0.2)] pt-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => void updateContestant({ status: "INACTIVE" })}
              disabled={isSaving || isUploadingImage}
              className="w-full border border-red-900/50 bg-red-950/30 px-4 py-2.5 font-raleway text-xs uppercase tracking-wider text-red-400 disabled:opacity-50 sm:w-auto"
            >
              {isSaving ? "Saving..." : "Decline / Inactive"}
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void updateContestant(buildUpdate())}
                disabled={isSaving || isUploadingImage}
                className="w-full border border-[rgba(201,168,76,0.4)] px-4 py-2.5 font-raleway text-xs uppercase tracking-wider text-[#F5EDD6] disabled:opacity-50 sm:w-auto"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => void updateContestant(buildUpdate("ACTIVE"))}
                disabled={isSaving || isUploadingImage || contestant.status === "ACTIVE"}
                className="w-full border border-[#C9A84C] bg-[#C9A84C] px-5 py-2.5 font-raleway text-xs font-medium uppercase tracking-wider text-[#101010] disabled:opacity-50 sm:w-auto"
              >
                {contestant.status === "ACTIVE" ? "Approved" : "Approve"}
              </button>
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}
