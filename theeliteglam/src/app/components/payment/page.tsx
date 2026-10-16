"use client";
import { useState } from "react";

export default function Payment() {
  const [email, setEmail] = useState("");
  const [ticketTypeId, setTicketId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const result = await fetch("/api/ticket/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ticketTypeId, quantity, phoneNumber, eventId, name }),
      });

      const paystackResult = await result.json();

      if (!result.ok || !paystackResult.status || !paystackResult.data?.authorization_url) {
        setErrorMessage(paystackResult.error || paystackResult.message || "Unable to start payment.");
        return;
      }

      window.location.assign(paystackResult.data.authorization_url);
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("Something went wrong while starting payment. Please try again.");
    }
  };
  return (
    <div className="login-form-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h2>Buy Ticket</h2>
          {errorMessage && <p role="alert">{errorMessage}</p>}

          {/* EMAIL */}
          <div className="login-field">
            <label>Email</label>
            <div className="input-group">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="login-field">
            <label>name</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="joe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Ticket ID */}
          <div className="login-field">
            <label>Ticket ID</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Ticket ID"
                value={ticketTypeId}
                onChange={(e) => setTicketId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="login-field">
            <label>Quantity</label>
            <div className="input-group">
              <input
                type="number"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="login-field">
            <label>Phone Number</label>
            <div className="input-group">
              <input
                type="tel"
                placeholder="+2348012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Event ID */}
          <div className="login-field">
            <label>Event ID</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Event ID"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="amount">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
