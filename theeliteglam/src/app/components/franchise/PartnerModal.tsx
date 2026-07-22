"use client";

import React, { useState } from "react";

function ModalField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          color: "#9A8C6A",
          textTransform: "uppercase",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange as any}
        required={required}
        style={{
          width: "100%",
          background: "rgba(201,168,76,0.04)",
          border: "1px solid rgba(201,168,76,0.18)",
          borderBottom: "1px solid rgba(201,168,76,0.35)",
          color: "#F5EDD6",
          fontFamily: "'Raleway', sans-serif",
          fontSize: "0.88rem",
          padding: "0.8rem 1rem",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.3s",
        }}
      />
    </div>
  );
}

export default function PartnerModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.company) setSubmitted(true);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(5,5,5,0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0D0D0D",
          border: "1px solid rgba(201,168,76,0.22)",
          maxWidth: "560px",
          width: "100%",
          padding: "3.5rem",
          position: "relative",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "1px",
            background: "linear-gradient(to right, transparent, #C9A84C, transparent)",
          }}
        />

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "none",
            color: "#9A8C6A",
            cursor: "pointer",
            fontFamily: "'Raleway', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          ✕ Close
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.5rem",
                color: "#C9A84C",
                marginBottom: "1rem",
                letterSpacing: "0.06em",
              }}
            >
              ✦ Thank You
            </div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                color: "#9A8C6A",
                fontStyle: "italic",
                lineHeight: 1.7,
              }}
            >
              Your partnership inquiry has been received. Our team will be in touch shortly.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                fontFamily: "'Raleway', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.4em",
                color: "#C9A84C",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Partnership Enquiry
            </div>
            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.6rem",
                color: "#F5EDD6",
                letterSpacing: "0.05em",
                marginBottom: "0.5rem",
                lineHeight: 1.15,
              }}
            >
              Partner With Us
            </h2>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "0.9rem",
                color: "#9A8C6A",
                fontStyle: "italic",
                lineHeight: 1.65,
                marginBottom: "2.5rem",
              }}
            >
              Tell us about your brand and how you'd like to collaborate.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <ModalField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <ModalField
                  label="Company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <ModalField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <ModalField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.25em",
                    color: "#9A8C6A",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  Partnership Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange as any}
                  style={{
                    width: "100%",
                    background: "rgba(201,168,76,0.04)",
                    border: "1px solid rgba(201,168,76,0.18)",
                    borderBottom: "1px solid rgba(201,168,76,0.35)",
                    color: form.type ? "#F5EDD6" : "#5A5040",
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.88rem",
                    padding: "0.8rem 1rem",
                    outline: "none",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  <option value="title">Title Sponsor</option>
                  <option value="gold">Gold Sponsor</option>
                  <option value="media">Media Partner</option>
                  <option value="product">Product / Gift Partner</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.25em",
                    color: "#9A8C6A",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange as any}
                  rows={4}
                  placeholder="Tell us about your brand and goals..."
                  style={{
                    width: "100%",
                    background: "rgba(201,168,76,0.04)",
                    border: "1px solid rgba(201,168,76,0.18)",
                    borderBottom: "1px solid rgba(201,168,76,0.35)",
                    color: "#F5EDD6",
                    fontFamily: "'Raleway', sans-serif",
                    fontSize: "0.88rem",
                    padding: "0.8rem 1rem",
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "0.5rem",
                  background: "linear-gradient(135deg, #C9A84C, #8B6914)",
                  border: "none",
                  color: "#080808",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.2em",
                  padding: "1rem 2rem",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, #F0C04A, #C9A84C)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 8px 30px rgba(201,168,76,0.35)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "linear-gradient(135deg, #C9A84C, #8B6914)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "none";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }}
              >
                Submit Inquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
