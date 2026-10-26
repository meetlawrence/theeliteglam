import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContestantFormEmailProps {
  firstName?: string;
  formLink: string;
  reference: string;
  eventName?: string;
  baseUrl?: string; // Optional base URL to source logo assets dynamically (e.g. https://theeliteglam.com)
}

export const ContestantFormEmail = ({
  firstName = "Contestant",
  formLink,
  reference,
  eventName = "The EliteGlam Pageant",
  baseUrl = "https://theeliteglam.com",
}: ContestantFormEmailProps) => {
  const previewText = `Complete your registration for ${eventName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Top Gold Gradient Accent Line */}
          <Section style={topAccentLine} />

          {/* Logo Header */}
          <Section style={logoContainer}>
            <Img
              src={`${baseUrl}/logo.svg`}
              alt="Crown"
              width="60"
              height="27"
              style={logoImage}
            />
            <Img
              src={`${baseUrl}/wordmark.svg`}
              alt="Elite Glam"
              width="85"
              height="19"
              style={wordmarkImage}
            />
          </Section>

          {/* Header Section */}
          <Section style={headerSection}>
            <Heading style={h1}>Payment Confirmed</Heading>
            <Text style={subtitle}>
              Hi {firstName}, thank you for registering for {eventName}.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Content */}
          <Section>
            <Text style={text}>
              Your payment was successful. Please click the button below to complete
              your contestant application form.
            </Text>

            {/* Reference Badge */}
            <Section style={referenceBox}>
              <Text style={label}>Transaction Reference</Text>
              <Text style={value}>{reference}</Text>
            </Section>

            {/* Action Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={formLink}>
                Proceed to Application Form
              </Button>
            </Section>

            <Text style={fallbackText}>
              Or copy and paste this URL into your browser:
            </Text>
            <Text style={linkText}>{formLink}</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer Section */}
          <Section style={footer}>
            <Text style={footerText}>
              If you did not request this, you can safely ignore this email.
            </Text>
            <Text style={supportText}>
              Need assistance? Contact{" "}
              <a href="mailto:support@theeliteglam.com" style={supportLink}>
                support@theeliteglam.com
              </a>
            </Text>
            <Text style={copyrightText}>
              © {new Date().getFullYear()} The EliteGlam. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ContestantFormEmail;

// ------------------- Styles -------------------
const main = {
  backgroundColor: "#0A0A0A",
  fontFamily:
    'Raleway, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 10px",
};

const container = {
  backgroundColor: "#121212",
  border: "1px solid rgba(201, 168, 76, 0.2)",
  margin: "0 auto",
  padding: "0 32px 40px 32px",
  maxWidth: "520px",
  width: "100%",
  boxShadow: "0 20px 30px rgba(0,0,0,0.5)",
  position: "relative" as const,
};

const topAccentLine = {
  height: "2px",
  backgroundColor: "#C9A84C",
  margin: "0 -32px 32px -32px",
  width: "calc(100% + 64px)",
};

const logoContainer = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const logoImage = {
  display: "inline-block",
  verticalAlign: "middle",
  marginRight: "8px",
};

const wordmarkImage = {
  display: "inline-block",
  verticalAlign: "middle",
};

const headerSection = {
  textAlign: "center" as const,
};

const h1 = {
  color: "#F5EDD6",
  fontSize: "24px",
  fontWeight: "normal",
  fontFamily: 'Cinzel, Georgia, "Times New Roman", serif',
  letterSpacing: "0.04em",
  margin: "0 0 12px 0",
};

const subtitle = {
  color: "#9A8C6A",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const text = {
  color: "#9A8C6A",
  fontSize: "14px",
  lineHeight: "1.7",
  textAlign: "center" as const,
  margin: "16px 0",
};

const referenceBox = {
  backgroundColor: "#0A0A0A",
  border: "1px solid rgba(201, 168, 76, 0.15)",
  padding: "12px 16px",
  textAlign: "center" as const,
  margin: "20px 0",
};

const label = {
  color: "#5A5040",
  fontSize: "10px",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  margin: "0 0 4px 0",
};

const value = {
  color: "#9A8C6A",
  fontSize: "13px",
  fontFamily: 'monospace, "Courier New", Courier',
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "28px 0",
};

const button = {
  backgroundColor: "#C9A84C",
  color: "#080808",
  fontFamily: 'Cinzel, Georgia, "Times New Roman", serif',
  fontSize: "12px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
  width: "100%",
  boxSizing: "border-box" as const,
};

const fallbackText = {
  color: "#5A5040",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "16px 0 4px 0",
};

const linkText = {
  color: "#9A8C6A",
  fontSize: "12px",
  textAlign: "center" as const,
  wordBreak: "break-all" as const,
  margin: "0 0 20px 0",
};

const hr = {
  borderColor: "rgba(201, 168, 76, 0.15)",
  margin: "28px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  color: "#5A5040",
  fontSize: "12px",
  margin: "0 0 8px 0",
};

const supportText = {
  color: "#5A5040",
  fontSize: "12px",
  margin: "0 0 8px 0",
};

const supportLink = {
  color: "#9A8C6A",
  textDecoration: "underline",
};

const copyrightText = {
  color: "#5A5040",
  fontSize: "11px",
  margin: "12px 0 0 0",
};