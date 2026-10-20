import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContestantFormEmailProps {
  firstName: string;
  formLink: string;
  reference: string;
  eventName?: string;
}

export const ContestantFormEmail = ({
  firstName = "Contestant",
  formLink,
  reference,
  eventName = "theeliteglam Event",
}: ContestantFormEmailProps) => {
  const previewText = `Complete your registration for ${eventName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Complete Your Registration</Heading>
            <Text style={subtitle}>
              Hi {firstName}, thank you for your interest in {eventName}.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Content */}
          <Section>
            <Text style={text}>
              Your payment was successful. Please click the button below to complete
              your contestant registration form.
            </Text>

            <Text style={label}>Reference</Text>
            <Text style={value}>{reference}</Text>

            <Section style={buttonContainer}>
              <Button style={button} href={formLink}>
                Complete Registration Form
              </Button>
            </Section>

            <Text style={text}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={linkText}>{formLink}</Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you did not request this, you can safely ignore this email.
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} theeliteglam. All rights reserved.
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
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const subtitle = {
  color: "#666666",
  fontSize: "16px",
  margin: "0",
};

const text = {
  color: "#525f7f",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "16px 0",
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
  margin: "0 0 20px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "28px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const linkText = {
  color: "#556cd6",
  fontSize: "13px",
  wordBreak: "break-all" as const,
  margin: "0 0 20px",
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