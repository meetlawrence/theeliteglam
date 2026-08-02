"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { TextareaField } from "./TextareaField";
import { STATES, TRIBES } from "./constants";

export function ApplicationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    stateOfOrigin: "",
    tribe: "",
    occupation: "",
    employer: "",
    instagram: "",
    tiktok: "",
    advocacy: "",
    bio: "",
    funFact: "",
    agreeTerms: false,
    agreePhoto: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [section, setSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key: string, value: string | boolean) =>
    setFormData((f) => ({ ...f, [key]: value }));

  const buildPayload = () => {
    const fullName = [formData.firstName.trim(), formData.lastName.trim()].filter(Boolean).join(" ");
    const dob = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }

    return {
      id: Date.now(),
      name: fullName,
      email: formData.email.trim(),
      gender: formData.gender.toLowerCase() === "male" ? "male" : "female",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
      phone: formData.phone.trim(),
      age: Number.isFinite(age) && age > 0 ? age : 18,
      state: formData.stateOfOrigin.trim(),
      number: "",
      bio: formData.bio.trim(),
      occupation: formData.occupation.trim(),
      advocacy: formData.advocacy.trim(),
      funFact: formData.funFact.trim(),
      tribe: formData.tribe.trim(),
      votes: 0,
    };
  };

  const sections = [
    {
      title: "Personal Information",
      fields: (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" type="text" value={formData.firstName} onChange={(v) => set("firstName", v)} required placeholder="Amaka" />
            <FormField label="Last Name" type="text" value={formData.lastName} onChange={(v) => set("lastName", v)} required placeholder="Okafor" />
          </div>
          <FormField label="Email Address" type="email" value={formData.email} onChange={(v) => set("email", v)} required placeholder="amaka@email.com" />
          <FormField label="Phone Number" type="tel" value={formData.phone} onChange={(v) => set("phone", v)} required placeholder="+234 801 234 5678" />
          <FormField label="Date of Birth" type="date" value={formData.dob} onChange={(v) => set("dob", v)} required placeholder="" />
          <div>
            <label className="block font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.2em] text-[#9A8C6A] uppercase mb-[0.5rem]">
              Gender Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Female', 'Male'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('gender', g)}
                  className={`py-3.5 px-4 font-['Cinzel',serif] text-[0.78rem] tracking-[0.15em] uppercase cursor-pointer transition-all ${
                    formData.gender === g
                      ? 'bg-[#C9A84C]/12 border border-[#C9A84C] text-[#F0C04A]'
                      : 'bg-white/[0.02] border border-[#C9A84C]/20 text-[#9A8C6A]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Background & Heritage",
      fields: (
        <div className="flex flex-col gap-5">
          <SelectField
            label="State of Origin"
            value={formData.stateOfOrigin}
            onChange={(v) => set("stateOfOrigin", v)}
            options={STATES}
            placeholder="Select state"
          />
          <SelectField
            label="Tribe / Ethnic Group"
            value={formData.tribe}
            onChange={(v) => set("tribe", v)}
            options={TRIBES}
            placeholder="Select tribe"
          />
          <FormField label="Occupation / Profession" type="text" value={formData.occupation} onChange={(v) => set("occupation", v)} required placeholder="e.g. Medical Student, Fashion Designer" />
          <FormField label="Employer / Institution (optional)" type="text" value={formData.employer} onChange={(v) => set("employer", v)} placeholder="e.g. University of Lagos" />
        </div>
      ),
    },
    {
      title: "Platform & Advocacy",
      fields: (
        <div className="flex flex-col gap-5">
          <TextareaField
            label="Your Advocacy / Cause"
            value={formData.advocacy}
            onChange={(v) => set("advocacy", v)}
            required
            placeholder="Describe the cause or issue you are most passionate about and how you are already making an impact…"
            rows={4}
          />
          <TextareaField
            label="Personal Bio"
            value={formData.bio}
            onChange={(v) => set("bio", v)}
            required
            placeholder="Tell us about yourself — your background, achievements, and what drives you…"
            rows={5}
          />
          <FormField label="Fun Fact About You" type="text" value={formData.funFact} onChange={(v) => set("funFact", v)} placeholder="Something surprising or memorable" />
        </div>
      ),
    },
    {
      title: "Social Media",
      fields: (
        <div className="flex flex-col gap-5">
          <FormField label="Instagram Handle" type="text" value={formData.instagram} onChange={(v) => set("instagram", v)} placeholder="@yourhandle" />
          <FormField label="TikTok Handle (optional)" type="text" value={formData.tiktok} onChange={(v) => set("tiktok", v)} placeholder="@yourhandle" />

          <div className="h-[1px] bg-[#C9A84C]/10 my-2" />

          <div>
            <label className="block font-['Raleway',sans-serif] text-[0.72rem] tracking-[0.2em] text-[#9A8C6A] uppercase mb-[0.5rem]">
              Profile Photo
            </label>
            <div className="border border-dashed border-[#C9A84C]/25 p-10 text-center bg-[#C9A84C]/[0.03] cursor-pointer">
              <div className="text-[2rem] mb-3 text-[#C9A84C]">↑</div>
              <div className="font-['Cinzel',serif] text-[0.78rem] text-[#C4B896] tracking-[0.1em] mb-1.5">
                Upload a recent photo
              </div>
              <div className="font-['Raleway',sans-serif] text-[0.68rem] text-[#5A5040] tracking-[0.1em]">
                JPG or PNG · Minimum 800×1000px · Max 5MB
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-[#C9A84C]/10 my-2" />

          <div className="flex flex-col gap-4">
            {[
              { key: "agreeTerms", text: "I confirm that all information provided is accurate and that I meet the eligibility requirements for The Elite Glam Season 2." },
              { key: "agreePhoto", text: "I consent to The Elite Glam using my submitted photo and information for internal selection purposes." },
            ].map(({ key, text }) => {
              const checked = Boolean((formData as Record<string, string | boolean>)[key]);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => set(key, !checked)}
                  className="flex items-start gap-3.5 bg-transparent border-none cursor-pointer text-left p-0"
                >
                  <div className={`w-[18px] h-[18px] shrink-0 border flex items-center justify-center mt-0.5 transition-colors ${checked ? "border-[#C9A84C] bg-[#C9A84C]/12" : "border-[#C9A84C]/25 bg-transparent"}`}>
                    {checked && <Check size={11} className="text-[#F0C04A]" />}
                  </div>
                  <span className="font-['Raleway',sans-serif] text-[0.82rem] text-[#9A8C6A] leading-[1.65]">
                    {text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  const isLast = section === sections.length - 1;
  const canSubmit =
    Boolean(formData.agreeTerms) &&
    Boolean(formData.agreePhoto) &&
    Boolean(formData.gender) &&
    Boolean(formData.firstName.trim()) &&
    Boolean(formData.lastName.trim()) &&
    Boolean(formData.email.trim()) &&
    Boolean(formData.phone.trim()) &&
    Boolean(formData.dob) &&
    Boolean(formData.stateOfOrigin) &&
    Boolean(formData.tribe) &&
    Boolean(formData.occupation.trim()) &&
    Boolean(formData.advocacy.trim()) &&
    Boolean(formData.bio.trim()) &&
    Boolean(formData.funFact.trim());

  const handleNext = async () => {
    if (!isLast) {
      setSection((s) => s + 1);
      return;
    }

    if (!canSubmit) {
      setSubmitError("Please complete every required field and confirm both declarations to submit.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const storedRaw = window.localStorage.getItem("eliteGlamClientContestants");
      const stored = storedRaw ? JSON.parse(storedRaw) : [];
      const nextPayload = buildPayload();
      const nextEntries = Array.isArray(stored) ? [...stored, nextPayload] : [nextPayload];

      window.localStorage.setItem("eliteGlamClientContestants", JSON.stringify(nextEntries));
      window.dispatchEvent(new Event("elite-glam-contestants-updated"));
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit your application right now.");
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
          You've Applied, {formData.firstName}.
        </h2>
        <p className="font-['Playfair_Display',serif] text-[1rem] text-[#9A8C6A] italic leading-[1.8] max-w-[460px] mx-auto mb-10">
          Your application for The Elite Glam Season 2 has been received. We will review every submission with care.
        </p>

        <div className="bg-[#C9A84C]/[0.05] border border-[#C9A84C]/15 py-7 px-8 mb-8 text-left">
          <div className="flex flex-col gap-3.5">
            {[
              `A confirmation has been sent to ${formData.email}`,
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
        {sections.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-[3px] transition-colors duration-400 ${i <= section ? "bg-[#C9A84C]" : "bg-[#C9A84C]/12"}`}
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
            onClick={() => setSection((s) => s - 1)}
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
          Please complete every required field and agree to both declarations above to submit.
        </p>
      )}
    </div>
  );
}
