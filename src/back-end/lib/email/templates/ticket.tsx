// emails/TicketEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Button,
} from "@react-email/components";
import * as React from "react";

interface TicketEmailProps {
  firstName: string;
  ticketReference: string;
  quantity: number;
  amount: number | null;
  eventName?: string;
  eventDate?: string;
  qrCode?: string;          // single QR (base64)
  qrCodes: string[];       // multiple QRs
}

export const TicketEmail = ({
  firstName = "Guest",
  ticketReference = "TKT-XXXX",
  quantity = 1,
  amount,
  eventName = "Handcrafted Haven Event",
  eventDate,
  qrCode,
  qrCodes,
}: TicketEmailProps) => {
  const previewText = `Your ticket for ${eventName} is ready!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🎟 Your Ticket is Ready!</Heading>
            <Text style={subtitle}>
              Hi {firstName}, thank you for your purchase.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Ticket Details */}
          <Section style={detailsSection}>
            <Text style={label}>Event</Text>
            <Text style={value}>{eventName}</Text>

            {eventDate && (
              <>
                <Text style={label}>Date</Text>
                <Text style={value}>{eventDate}</Text>
              </>
            )}

            <Text style={label}>Reference</Text>
            <Text style={value}>{ticketReference}</Text>

            <Text style={label}>Quantity</Text>
            <Text style={value}>{quantity} ticket{quantity > 1 ? "s" : ""}</Text>

            {amount && (
              <>
                <Text style={label}>Amount Paid</Text>
                <Text style={value}>₦{amount}</Text>
              </>
            )}
          </Section>

          <Hr style={hr} />

          {/* QR Codes */}
          <Section style={qrSection}>
            <Heading as="h2" style={h2}>
              {quantity > 1 ? "Your Tickets" : "Your Ticket QR Code"}
            </Heading>
            <Text style={text}>
              Show this QR code at the entrance. Each code is unique.
            </Text>

            {/* Single QR */}
            {qrCode && (
              <Section style={qrWrapper}>
                <Img
                  src={qrCode}
                  width="240"
                  height="240"
                  alt="Ticket QR Code"
                  style={qrImage}
                />
                <Text style={ticketNumber}>Ticket #1</Text>
              </Section>
            )}

            {/* Multiple QRs */}
            {qrCodes &&
              qrCodes.map((qr, index) => (
                <Section key={index} style={qrWrapper}>
                  <Img
                    src={qr}
                    width="220"
                    height="220"
                    alt={`Ticket ${index + 1} QR Code`}
                    style={qrImage}
                  />
                  <Text style={ticketNumber}>Ticket #{index + 1}</Text>
                </Section>
              ))}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Need help? Just reply to this email.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} Handcrafted Haven. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TicketEmail;

// ------------------- Styles -------------------
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "580px",
  borderRadius: "8px",
};

const header = {
  textAlign: "center" as const,
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 10px",
};

const h2 = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 12px",
  textAlign: "center" as const,
};

const subtitle = {
  color: "#666666",
  fontSize: "16px",
  margin: "0",
};

const detailsSection = {
  padding: "10px 0",
};

const label = {
  color: "#8898aa",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  margin: "16px 0 4px",
};

const value = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 8px",
};

const qrSection = {
  textAlign: "center" as const,
  padding: "10px 0",
};

const text = {
  color: "#666666",
  fontSize: "14px",
  margin: "0 0 24px",
};

const qrWrapper = {
  margin: "20px 0",
  textAlign: "center" as const,
};

const qrImage = {
  borderRadius: "12px",
  border: "1px solid #e6ebf1",
  margin: "0 auto",
};

const ticketNumber = {
  color: "#8898aa",
  fontSize: "13px",
  margin: "8px 0 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "28px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  margin: "4px 0",
};