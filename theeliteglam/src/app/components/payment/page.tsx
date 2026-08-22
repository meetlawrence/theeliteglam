"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Payment() {
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [ticketTypeId, setTicketId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState("");
  const [method, setMethod] = useState<"PAYSTACK" | "OPAY">("PAYSTACK");
  const [purpose, setPurpose] = useState<"TICKET" | "CONTESTANT">("CONTESTANT");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Build payload with optional fields
    const payload: any = {
      purpose,
      method,
      eventId,
      email,
      phoneNumber,
      name,
    };

    if (ticketTypeId) payload.ticketTypeId = ticketTypeId;
    if (quantity) payload.quantity = quantity;

    try {
      const result = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const paystackResult = await result.json();
      console.log("Payment API Response:", paystackResult);

      if (result.ok && paystackResult.data?.authorizationUrl) {
        router.push(paystackResult.data.authorizationUrl);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h2>Initialize Payment</h2>

          {/* Purpose */}
          <div className="login-field">
            <label>Purpose</label>
            <select value={purpose} onChange={(e) => setPurpose(e.target.value as "TICKET" | "CONTESTANT")}>
              <option value="CONTESTANT">Contestant</option>
              <option value="TICKET">Ticket</option>
            </select>
          </div>

          {/* Method */}
          <div className="login-field">
            <label>Payment Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value as "PAYSTACK" | "OPAY")}>
              <option value="PAYSTACK">Paystack</option>
              <option value="OPAY">Opay</option>
            </select>
          </div>

          {/* Email */}
          <div className="login-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {/* Name */}
          <div className="login-field">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          {/* Ticket ID (optional) */}
          <div className="login-field">
            <label>Ticket Type ID (optional)</label>
            <input type="text" value={ticketTypeId ?? ""} onChange={(e) => setTicketId(e.target.value || undefined)} />
          </div>

          {/* Quantity (optional) */}
          <div className="login-field">
            <label>Quantity (optional)</label>
            <input
              type="number"
              value={quantity ?? ""}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          {/* Phone Number */}
          <div className="login-field">
            <label>Phone Number</label>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </div>

          {/* Event ID */}
          <div className="login-field">
            <label>Event ID</label>
            <input type="text" value={eventId} onChange={(e) => setEventId(e.target.value)} required />
          </div>

          <button type="submit" className="amount">Submit</button>
        </form>
      </div>
    </div>
  );
}
