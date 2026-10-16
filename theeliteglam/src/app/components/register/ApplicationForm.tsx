"use client";

import React, { useState, type ChangeEvent } from "react";
import { ArrowRight, Check, AlertCircle, Upload } from "lucide-react";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { STATES, TRIBES } from "./constants";

type ContestantCategory = "MALE" | "FEMALE";

type ApplicationFormData = {
  name: string;
  email: string;
  gender: string;
  image: string;
  stageName: string;
  height: string;
  weight: string;
  bio: string;
  portfolio: string;
  phone: string;
  age: string;
  state: string;
  country: string;
  occupation: string;
  advocacy: string;
  funFact: string;
  tribe: string;
  contestantCategories: string;
};

const initialFormData: ApplicationFormData = {
  name: "",
  email: "",
  gender: "",
  image: "",
  stageName: "",
  height: "",
  weight: "",
  bio: "",
  portfolio: "",
  phone: "",
  age: "",
  state: "",
  country: "Nigeria",
  occupation: "",
  advocacy: "",
  funFact: "",
  tribe: "",
  contestantCategories: "",
};

function isContestantCategory(value: string): value is ContestantCategory {
  return value === "MALE" || value === "FEMALE";
}

function isValidUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ApplicationForm({ reference }: { reference: string }) {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [section, setSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof ApplicationFormData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((current) => ({
        ...current,
        image: "Choose a JPG, PNG, or WebP image.",
      }));
      return;
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setErrors((current) => ({
        ...current,
        image: "Choose an image no larger than 5 MB.",
      }));
      return;
    }
    if (!reference.trim()) {
      setErrors((current) => ({
        ...current,
        image: "Your payment reference is missing. Please return to registration.",
      }));
      return;
    }

    setIsUploadingImage(true);
    setErrors((current) => {
      const next = { ...current };
      delete next.image;
      return next;
    });
    setSubmitError("");

    try {
      const uploadData = new FormData();
      uploadData.set("image", file);
      uploadData.set("reference", reference);

      const response = await fetch("/api/contestants/application-image", {
        method: "POST",
        body: uploadData,
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.imageUrl) {
        throw new Error(result.error || result.message || "Unable to upload image.");
      }

      set("image", result.data.imageUrl);
    } catch (uploadError) {
      setErrors((current) => ({
        ...current,
        image: uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload image.",
      }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  // --- Per-Section Field Validation ---
  const validateSection = (currentSection: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentSection === 0) {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        newErrors.name = "Full name is required";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 7) {
        newErrors.phone = "Valid phone number is required";
      }
      const ageNum = Number(formData.age);
      if (!formData.age || !Number.isInteger(ageNum) || ageNum < 16 || ageNum > 80) {
        newErrors.age = "Please enter a valid age (16+)";
      }
      if (!isContestantCategory(formData.gender)) {
        newErrors.gender = "Please select a gender category";
      }
    }

    if (currentSection === 1) {
      if (!formData.state) newErrors.state = "Please select your state";
      if (formData.country.trim().length < 2) newErrors.country = "Enter a valid country";
      if (formData.tribe.trim().length < 2) {
        newErrors.tribe = "Please select your tribe / ethnic group";
      }
      if (formData.occupation.trim().length < 2) {
        newErrors.occupation = "Occupation must be at least 2 characters";
      }

      if (formData.stageName.trim() && formData.stageName.trim().length < 2) {
        newErrors.stageName = "Stage name must be at least 2 characters";
      }
      if (formData.height && (!Number.isFinite(Number(formData.height)) || Number(formData.height) <= 0)) {
        newErrors.height = "Enter a valid height in cm";
      }
      if (formData.weight && (!Number.isFinite(Number(formData.weight)) || Number(formData.weight) <= 0)) {
        newErrors.weight = "Enter a valid weight in kg";
      }
    }

    if (currentSection === 2) {
      if (!formData.advocacy.trim() || formData.advocacy.trim().length < 10) {
        newErrors.advocacy = "Please describe your advocacy cause (min. 10 characters)";
      }
      if (formData.funFact.trim().length < 2) {
        newErrors.funFact = "Please share a fun fact (at least 2 characters)";
      }
      if (!formData.image.trim()) {
        newErrors.image = "Upload a profile image to continue.";
      }
      if (formData.portfolio.trim() && !isValidUrl(formData.portfolio.trim())) {
        newErrors.portfolio = "Please enter a valid portfolio URL starting with http:// or https://";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sections = [
    {
      title: "Personal Information",
      fields: (
        <div className="flex flex-col gap-5">
          <FormField
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(value) => set("name", value)}
            required
            placeholder="Amaka Adeyinka"
            error={errors.name}
          />
          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => set("email", value)}
            required
            placeholder="amaka@email.com"
            error={errors.email}
          />
          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => set("phone", value)}
            required
            placeholder="+234 801 234 5678"
            error={errors.phone}
          />
          <FormField
            label="Age"
            type="number"
            value={formData.age}
            onChange={(value) => set("age", value)}
            required
            min="16"
            max="80"
            step="1"
            placeholder="25"
            error={errors.age}
          />
          <div>
            <label id="gender-label" className="block font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.2em] text-[#9A8C6A] uppercase mb-[0.5rem]">
              Category / Gender *
            </label>
            <div
              className="grid grid-cols-2 gap-3"
              role="group"
              aria-labelledby="gender-label"
              aria-invalid={Boolean(errors.gender)}
              aria-describedby={errors.gender ? "gender-error" : undefined}
            >
              {(["FEMALE", "MALE"] as const).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  aria-pressed={formData.gender === gender}
                  onClick={() => {
                    set("gender", gender);
                    set("contestantCategories", gender);
                  }}
                  className={`py-3.5 px-4 font-['Cinzel',serif] text-[0.78rem] tracking-[0.15em] uppercase cursor-pointer transition-all ${
                    formData.gender === gender
                      ? "bg-[#C9A84C]/12 border border-[#C9A84C] text-[#F0C04A]"
                      : errors.gender
                        ? "bg-white/[0.02] border border-[#C96B5D] text-[#9A8C6A]"
                        : "bg-white/[0.02] border border-[#C9A84C]/20 text-[#9A8C6A]"
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
            {errors.gender && (
              <p id="gender-error" role="alert" className="font-['Raleway',sans-serif] text-[0.7rem] text-[#C96B5D] mt-1.5">
                {errors.gender}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Background & Profile",
      fields: (
        <div className="flex flex-col gap-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Height (cm) *"
              type="number"
              value={formData.height}
              onChange={(value) => set("height", value)}
              min="0"
              step="any"
              placeholder="175"
              required
              error={errors.height}
            />
            <FormField
              label="Weight (kg)"
              type="number"
              value={formData.weight}
              onChange={(value) => set("weight", value)}
              min="0"
              step="any"
              placeholder="65"
              required
              error={errors.weight}
            />
          </div>
          <SelectField
            label="State *"
            value={formData.state}
            onChange={(value) => set("state", value)}
            options={STATES}
            placeholder="Select state"
            required
            error={errors.state}
          />
          <FormField
            label="Country"
            type="text"
            value={formData.country}
            onChange={(value) => set("country", value)}
            required
            placeholder="Nigeria"
            error={errors.country}
          />
          <SelectField
            label="Tribe / Ethnic Group *"
            value={formData.tribe}
            onChange={(value) => set("tribe", value)}
            options={TRIBES}
            placeholder="Select tribe"
            required
            error={errors.tribe}
          />
          <FormField
            label="Occupation / Profession"
            type="text"
            value={formData.occupation}
            onChange={(value) => set("occupation", value)}
            required
            placeholder="e.g. Medical Student, Fashion Designer"
            error={errors.occupation}
          />
        </div>
      ),
    },
    {
      title: "Application Details",
      fields: (
        <div className="flex flex-col gap-5">
          <TextareaField
            label="Advocacy / Cause *"
            value={formData.advocacy}
            onChange={(value) => set("advocacy", value)}
            required
            placeholder="Describe the cause or issue you are most passionate about and how you are making an impact…"
            rows={4}
            error={errors.advocacy}
          />
          <TextareaField
            label="Personal Bio (optional)"
            value={formData.bio}
            onChange={(value) => set("bio", value)}
            placeholder="Tell us about yourself, your background, and what drives you…"
            rows={4}
          />
          <FormField
            label="Fun Fact *"
            type="text"
            value={formData.funFact}
            onChange={(value) => set("funFact", value)}
            required
            placeholder="Something surprising or memorable"
            error={errors.funFact}
          />
          <div>
            <label
              htmlFor="profile-image"
              className="block font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.2em] text-[#9A8C6A] uppercase mb-[0.5rem]"
            >
              Profile Image *
            </label>
            <label
              htmlFor="profile-image"
              className={`flex min-h-24 cursor-pointer items-center justify-center gap-3 border border-dashed px-4 py-6 text-center transition-colors ${
                errors.image
                  ? "border-[#C96B5D] text-[#C96B5D]"
                  : "border-[#C9A84C]/30 text-[#9A8C6A] hover:border-[#C9A84C]"
              } ${isUploadingImage ? "cursor-wait opacity-60" : ""}`}
            >
              <Upload size={18} className="shrink-0 text-[#C9A84C]" />
              <span className="font-['Raleway',sans-serif] text-sm">
                {isUploadingImage
                  ? "Uploading image to secure storage..."
                  : formData.image
                    ? "Image uploaded. Choose another to replace it."
                    : "Choose a JPG, PNG, or WebP image (max 5 MB)"}
              </span>
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={isUploadingImage || isSubmitting}
              aria-invalid={Boolean(errors.image)}
              aria-describedby={errors.image ? "profile-image-error" : undefined}
              className="sr-only"
            />
            {formData.image && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={formData.image}
                  alt="Uploaded contestant profile"
                  className="h-20 w-20 rounded-full border border-[#C9A84C]/30 object-cover"
                />
                <span className="font-['Raleway',sans-serif] text-xs text-[#9A8C6A]">
                  Profile image ready
                </span>
              </div>
            )}
            {errors.image && (
              <p id="profile-image-error" role="alert" className="font-['Raleway',sans-serif] text-[0.7rem] text-[#C96B5D] mt-1.5">
                {errors.image}
              </p>
            )}
          </div>
          <FormField
            label="Portfolio URL (optional)"
            type="url"
            value={formData.portfolio}
            onChange={(value) => set("portfolio", value)}
            placeholder="https://example.com/portfolio"
            error={errors.portfolio}
          />
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    if (!validateSection(section)) {
      return;
    }

    if (section < sections.length - 1) {
      setSection((current) => current + 1);
      setSubmitError("");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        reference,
        name: formData.name.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        ...(formData.image.trim() && { image: formData.image.trim() }),
        ...(formData.stageName.trim() && { stageName: formData.stageName.trim() }),
        ...(formData.height && { height: Number(formData.height) }),
        ...(formData.weight && { weight: Number(formData.weight) }),
        ...(formData.bio.trim() && { bio: formData.bio.trim() }),
        ...(formData.portfolio.trim() && { portfolio: formData.portfolio.trim() }),
        phone: formData.phone.trim(),
        age: Number(formData.age),
        state: formData.state.trim(),
        country: formData.country.trim(),
        occupation: formData.occupation.trim(),
        advocacy: formData.advocacy.trim(),
        funFact: formData.funFact.trim(),
        tribe: formData.tribe.trim(),
        contestantCategories: formData.contestantCategories,
      };

      const response = await fetch(
        `/api/contestants/post-contestant?reference=${encodeURIComponent(reference)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to submit your application.");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your application right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[760px] mx-auto pt-24 pb-32 px-8">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.15),rgba(201,168,76,0.04))] border border-[#C9A84C]/40 flex items-center justify-center shadow-[0_0_50px_rgba(201,168,76,0.15)]">
          <Check size={32} className="text-[#F0C04A]" />
        </div>
        <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.42em] text-[#C9A84C] uppercase mb-3">
          Application Submitted
        </div>
        <h2 className="font-['Cinzel',serif] text-[clamp(1.6rem,3vw,2.2rem)] text-[#F5EDD6] tracking-[0.04em] leading-[1.15] mb-4">
          You&apos;ve Applied, {formData.name.trim().split(/\s+/)[0]}.
        </h2>
        <p className="font-['Playfair_Display',serif] text-[1rem] text-[#9A8C6A] italic leading-[1.8] max-w-[460px] mx-auto mb-10">
          Your application for The Elite Glam Pageant Season 2 has been received. We will review every submission with care.
        </p>
        <div className="bg-[#C9A84C]/[0.05] border border-[#C9A84C]/15 py-7 px-8 mb-8 text-left">
          <div className="flex flex-col gap-3.5">
            {[
              `Your application has been recorded for the ${formData.contestantCategories} category`,
              "Shortlisted applicants will be contacted within 2 weeks",
              "Keep an eye on your inbox — and your spam folder",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check size={13} className="text-[#C9A84C] shrink-0 mt-0.5" />
                <span className="font-['Raleway',sans-serif] text-[0.85rem] text-[#9A8C6A] leading-[1.6]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="font-['Raleway',sans-serif] text-[0.72rem] text-[#5A5040] leading-[1.6]">
          Questions? Contact us at <span className="text-[#9A8C6A]">apply@theeliteglam.com</span>
        </p>
      </div>
    );
  }

  const isLast = section === sections.length - 1;

  return (
    <div id="apply" className="max-w-[760px] mx-auto pt-44 pb-32 px-8">
      <div className="flex items-center gap-2 mb-3">
        <Check size={16} className="text-[#C9A84C]" />
        <span className="font-['Raleway',sans-serif] text-[0.65rem] tracking-[0.3em] text-[#C9A84C] uppercase">
          Payment Verified — Application Unlocked
        </span>
      </div>

      <h2 className="font-['Cinzel',serif] text-[clamp(1.8rem,3.5vw,2.6rem)] text-[#F5EDD6] tracking-[0.05em] leading-[1.1] mb-3">
        Application Form
      </h2>
      <p className="font-['Raleway',sans-serif] text-[0.88rem] text-[#9A8C6A] leading-[1.7] mb-12">
        Complete all sections carefully. Your answers will form the basis of your selection review.
      </p>

      {/* Progress Bars */}
      <div className="flex gap-1 mb-10">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-[3px] transition-colors duration-400 ${
              index <= section ? "bg-[#C9A84C]" : "bg-[#C9A84C]/12"
            }`}
          />
        ))}
      </div>

      <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.35em] text-[#9A8C6A] uppercase mb-1.5">
        Section {section + 1} of {sections.length}
      </div>
      <div className="font-['Cinzel',serif] text-[1.1rem] text-[#F5EDD6] tracking-[0.04em] mb-8">
        {sections[section].title}
      </div>

      {sections[section].fields}

      {/* Navigation Buttons */}
      <div
        className={`flex items-center mt-10 pt-8 border-t border-[#C9A84C]/10 ${
          section > 0 ? "justify-between" : "justify-end"
        }`}
      >
        {section > 0 && (
          <button
            type="button"
            onClick={() => {
              setSection((current) => current - 1);
              setSubmitError("");
            }}
            className="bg-transparent border border-[#C9A84C]/20 text-[#9A8C6A] py-3.5 px-6 font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.18em] uppercase cursor-pointer hover:border-[#C9A84C] transition-all"
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting || isUploadingImage}
          className={`py-3.5 px-8 font-['Cinzel',serif] text-[0.78rem] tracking-[0.2em] uppercase flex items-center gap-2.5 transition-all ${
            isSubmitting || isUploadingImage
              ? "bg-[#C9A84C]/[0.05] border border-[#C9A84C]/12 text-[#5A5040] cursor-not-allowed"
              : "bg-gradient-to-br from-[#C9A84C] to-[#8B6914] border-none text-[#080808] cursor-pointer hover:brightness-110"
          }`}
        >
          {isUploadingImage ? "Uploading Image..." : isSubmitting ? "Submitting..." : isLast ? "Submit Application" : "Continue"}
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Submission Errors */}
      {submitError && (
        <div role="alert" className="flex items-center justify-end gap-2 text-[#C96B5D] mt-4 font-['Raleway',sans-serif] text-[0.72rem]">
          <AlertCircle size={14} />
          <span>{submitError}</span>
        </div>
      )}
    </div>
  );
}

export default ApplicationForm;