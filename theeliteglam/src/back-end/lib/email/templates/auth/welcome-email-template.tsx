import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  firstName: string;
  dashboardUrl?: string;
}

export default function WelcomeEmail({
  firstName = "there",
  dashboardUrl = "https://theeliteglam.com/dashboard",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to theeliteglam</Preview>

      <Body
        style={{
          backgroundColor: "#f8f9fa",
          color: "#212529",
          fontFamily: "Arial, sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "40px 20px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {/* Logo */}
          <Section style={{ textAlign: "center", marginBottom: "30px" }}>
            <Img
              src="https://yourdomain.com/logo.png"
              width="180"
              alt="theeliteglam Logo"
              style={{ margin: "0 auto", display: "block" }}
            />
          </Section>

          {/* Welcome Heading */}
          <Heading
            style={{
              color: "#212529",
              fontSize: "32px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Welcome aboard, {firstName}! 👋
          </Heading>

          <Text
            style={{
              fontSize: "18px",
              color: "#495057",
              textAlign: "center",
              marginBottom: "35px",
            }}
          >
            You&apos;re now part of the Admin.
          </Text>

          {/* Main Content Box */}
          <Section
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              padding: "35px",
              border: "1px solid #e9ecef",
              marginBottom: "30px",
            }}
          >
            <Text
              style={{
                color: "#212529",
                lineHeight: "1.7",
                fontSize: "17px",
                marginBottom: "30px",
              }}
            >
              Thank you for joining <strong>theeliteglam</strong>.
            </Text>

            <Button
              href={dashboardUrl}
              style={{
                backgroundColor: "#ffc107",
                color: "#000000",
                fontSize: "18px",
                fontWeight: "600",
                padding: "16px 40px",
                borderRadius: "8px",
                textDecoration: "none",
                display: "block",
                textAlign: "center",
                margin: "0 auto",
                boxShadow: "0 4px 8px rgba(255, 193, 7, 0.3)",
              }}
            >
              Go to My Dashboard →
            </Button>
          </Section>

          <Hr style={{ borderColor: "#dee2e6", margin: "35px 0" }} />

          {/* Footer */}
          <Text
            style={{
              textAlign: "center",
              color: "#6c757d",
              fontSize: "14px",
            }}
          >
            Need help? Just reply to this email or join our{" "}
            <Link href="https://discord.gg/yourserver" style={{ color: "#ffc107" }}>
              Discord
            </Link>
            .
          </Text>

          <Text
            style={{
              textAlign: "center",
              color: "#6c757d",
              fontSize: "12px",
              marginTop: "20px",
            }}
          >
            © {new Date().getFullYear()} theeliteglam . All rights reserved.
            <br />
            Port Harcourt, Nigeria
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
