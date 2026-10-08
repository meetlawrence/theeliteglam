"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
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
  country: "",
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
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [section, setSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key: keyof ApplicationFormData, value: string) =>
    setFormData((current) => ({ ...current, [key]: value }));

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
            placeholder="Amaka Okafor"
          />
          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => set("email", value)}
            required
            placeholder="amaka@email.com"
          />
          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => set("phone", value)}
            required
            placeholder="+234 801 234 5678"
          />
          <FormField
            label="Age"
            type="number"
            value={formData.age}
            onChange={(value) => set("age", value)}
            required
            placeholder="25"
          />
          <div>
            <label className="block font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.2em] text-[#9A8C6A] uppercase mb-[0.5rem]">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["FEMALE", "MALE"] as const).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => {
                    set("gender", gender);
                    set("contestantCategories", gender);
                  }}
                  className={`py-3.5 px-4 font-['Cinzel',serif] text-[0.78rem] tracking-[0.15em] uppercase cursor-pointer transition-all ${
                    formData.gender === gender
                      ? "bg-[#C9A84C]/12 border border-[#C9A84C] text-[#F0C04A]"
                      : "bg-white/[0.02] border border-[#C9A84C]/20 text-[#9A8C6A]"
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Background & Profile",
      fields: (
        <div className="flex flex-col gap-5">
          <FormField
            label="Stage Name (optional)"
            type="text"
            value={formData.stageName}
            onChange={(value) => set("stageName", value)}
            placeholder="Your public or stage name"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Height (cm, optional)"
              type="number"
              value={formData.height}
              onChange={(value) => set("height", value)}
              placeholder="175"
            />
            <FormField
              label="Weight (kg, optional)"
              type="number"
              value={formData.weight}
              onChange={(value) => set("weight", value)}
              placeholder="65"
            />
          </div>
          <SelectField
            label="State"
            value={formData.state}
            onChange={(value) => set("state", value)}
            options={STATES}
            placeholder="Select state"
          />
          <FormField
            label="Country"
            type="text"
            value={formData.country}
            onChange={(value) => set("country", value)}
            required
            placeholder="Nigeria"
          />
          <SelectField
            label="Tribe / Ethnic Group"
            value={formData.tribe}
            onChange={(value) => set("tribe", value)}
            options={TRIBES}
            placeholder="Select tribe"
          />
          <FormField
            label="Occupation / Profession"
            type="text"
            value={formData.occupation}
            onChange={(value) => set("occupation", value)}
            required
            placeholder="e.g. Medical Student, Fashion Designer"
          />
        </div>
      ),
    },
    {
      title: "Application Details",
      fields: (
        <div className="flex flex-col gap-5">
          <TextareaField
            label="Advocacy / Cause"
            value={formData.advocacy}
            onChange={(value) => set("advocacy", value)}
            required
            placeholder="Describe the cause or issue you are most passionate about and how you are making an impact…"
            rows={4}
          />
          <TextareaField
            label="Personal Bio"
            value={formData.bio}
            onChange={(value) => set("bio", value)}
            placeholder="Tell us about yourself, your background, and what drives you…"
            rows={5}
          />
          <FormField
            label="Fun Fact"
            type="text"
            value={formData.funFact}
            onChange={(value) => set("funFact", value)}
            required
            placeholder="Something surprising or memorable"
          />
          <FormField
            label="Profile Image URL (optional)"
            type="url"
            value={formData.image}
            onChange={(value) => set("image", value)}
            placeholder="https://example.com/profile.jpg"
          />
          <FormField
            label="Portfolio URL (optional)"
            type="url"
            value={formData.portfolio}
            onChange={(value) => set("portfolio", value)}
            placeholder="https://example.com/portfolio"
          />
        </div>
      ),
    },
  ];

  const age = Number(formData.age);
  const height = formData.height ? Number(formData.height) : undefined;
  const weight = formData.weight ? Number(formData.weight) : undefined;
  const canSubmit =
    formData.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
    formData.phone.trim().length >= 7 &&
    Number.isInteger(age) &&
    age > 0 &&
    formData.state.trim().length >= 2 &&
    formData.country.trim().length >= 2 &&
    formData.occupation.trim().length >= 2 &&
    formData.advocacy.trim().length >= 2 &&
    formData.funFact.trim().length >= 2 &&
    formData.tribe.trim().length >= 2 &&
    isContestantCategory(formData.gender) &&
    isContestantCategory(formData.contestantCategories) &&
    (!formData.stageName || formData.stageName.trim().length >= 2) &&
    (height === undefined || (Number.isFinite(height) && height > 0)) &&
    (weight === undefined || (Number.isFinite(weight) && weight > 0)) &&
    isValidUrl(formData.image.trim()) &&
    isValidUrl(formData.portfolio.trim());

  const handleNext = async () => {
    if (section < sections.length - 1) {
      setSection((current) => current + 1);
      return;
    }

    if (!canSubmit) {
      setSubmitError("Please complete all required fields with valid values.");
      return;
    }

    if (
      !isContestantCategory(formData.gender) ||
      !isContestantCategory(formData.contestantCategories)
    ) {
      setSubmitError("Select a valid gender and contestant category.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        ...(formData.image.trim() && { image: formData.image.trim() }),
        ...(formData.stageName.trim() && { stageName: formData.stageName.trim() }),
        ...(height !== undefined && { height }),
        ...(weight !== undefined && { weight }),
        ...(formData.bio.trim() && { bio: formData.bio.trim() }),
        ...(formData.portfolio.trim() && { portfolio: formData.portfolio.trim() }),
        phone: formData.phone.trim(),
        age,
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
      const result: { success?: boolean; error?: string; message?: string } =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Unable to submit your application.");
      }

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your application right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
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
          Your application for The Elite Glam Season 2 has been received. We will review every submission with care.
        </p>
        <div className="bg-[#C9A84C]/[0.05] border border-[#C9A84C]/15 py-7 px-8 mb-8 text-left">
          <div className="flex flex-col gap-3.5">
            {[
              `Your application has been recorded for ${formData.email.trim()}`,
              "Shortlisted applicants will be contacted within 4 weeks",
              "Virtual auditions will be held in December 2026",
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
    <div>
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

      <div className="flex gap-1 mb-10">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-[3px] transition-colors duration-400 ${index <= section ? "bg-[#C9A84C]" : "bg-[#C9A84C]/12"}`}
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

      <div className={`flex items-center mt-10 pt-8 border-t border-[#C9A84C]/10 ${section > 0 ? "justify-between" : "justify-end"}`}>
        {section > 0 && (
          <button
            type="button"
            onClick={() => setSection((current) => current - 1)}
            className="bg-transparent border border-[#C9A84C]/20 text-[#9A8C6A] py-3.5 px-6 font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.18em] uppercase cursor-pointer"
          >
            ← Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={isLast && (!canSubmit || isSubmitting)}
          className={`py-3.5 px-8 font-['Cinzel',serif] text-[0.78rem] tracking-[0.2em] uppercase flex items-center gap-2.5 transition-all ${
            isLast && (!canSubmit || isSubmitting)
              ? "bg-[#C9A84C]/[0.05] border border-[#C9A84C]/12 text-[#5A5040] cursor-not-allowed"
              : "bg-gradient-to-br from-[#C9A84C] to-[#8B6914] border-none text-[#080808] cursor-pointer"
          }`}
        >
          {isSubmitting ? "Submitting..." : isLast ? "Submit Application" : "Continue"}
          <ArrowRight size={14} />
        </button>
      </div>

      {submitError && (
        <p className="font-['Raleway',sans-serif] text-[0.72rem] text-[#C96B5D] mt-4 text-right tracking-[0.05em]">
          {submitError}
        </p>
      )}

      {isLast && !canSubmit && !submitError && (
        <p className="font-['Raleway',sans-serif] text-[0.72rem] text-[#5A5040] mt-4 text-right tracking-[0.05em]">
          Please complete all required fields with valid values before submitting.
        </p>
      )}
    </div>
  );
}

export default ApplicationForm;
