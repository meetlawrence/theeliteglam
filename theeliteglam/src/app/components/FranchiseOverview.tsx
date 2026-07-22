import { useState, useEffect, useRef } from "react";
import SectionLabel from "./franchise/SectionLabel";
import BrandLogoCard from "./franchise/BrandLogoCard";
import SponsorCard from "./franchise/SponsorCard";
import FranchiseButton from "./franchise/FranchiseButton";
import SponsorButton from "./franchise/SponsorButton";
import PartnerModal from "./franchise/PartnerModal";
import { ENDORSEMENTS, SPONSORS } from "./franchise/franchiseData";

export function OverviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#0A0A0A",
        padding: "7rem 2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1779167327036-f651fbf9a0d2?w=1800&h=900&fit=crop&auto=format)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.04,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1300px", margin: "0 auto", position: "relative" }}>
        {/* ── FRANCHISE OVERVIEW ── */}
        <div
          style={{
            marginBottom: "7rem",
            transition: "all 1s ease",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(30px)",
          }}
        >
          <SectionLabel text="Franchise Overview" />

          {/* Brand logo cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.5rem",
              marginTop: "2.5rem",
              marginBottom: "3rem",
            }}
            className="franchise-grid"
          >
            {ENDORSEMENTS.map((e, i) => (
              <BrandLogoCard key={e.brand} item={e} index={i} inView={inView} />
            ))}
          </div>

          <FranchiseButton />
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)",
            marginBottom: "6rem",
          }}
        />

        {/* ── SPONSORS ── */}
        <div
          style={{
            transition: "all 1s ease 0.3s",
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(30px)",
          }}
        >
          <SectionLabel text="Our Sponsors" />
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)",
              color: "#F5EDD6",
              letterSpacing: "0.06em",
              marginTop: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            Our Prestigious Partners
          </h2>
          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "0.95rem",
              color: "#9A8C6A",
              maxWidth: "500px",
              lineHeight: 1.7,
              marginBottom: "3rem",
            }}
          >
            We are proud to collaborate with world-class brands who share our commitment to
            excellence, beauty, and empowerment.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {SPONSORS.map((sponsor, i) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} index={i} inView={inView} />
            ))}
          </div>

          {/* Become a sponsor CTA */}
          <div
            style={{
              marginTop: "4rem",
              padding: "3rem",
              border: "1px solid rgba(201,168,76,0.2)",
              background: "#0D0D0D",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: "2rem",
            }}
            className="sponsor-cta"
          >
            <div>
              <div
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.35em",
                  color: "#C9A84C",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Partnership Opportunities
              </div>
              <h3
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.4rem",
                  color: "#F5EDD6",
                  marginBottom: "0.5rem",
                }}
              >
                Become a Sponsor
              </h3>
              <p
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontSize: "0.9rem",
                  color: "#9A8C6A",
                  lineHeight: 1.6,
                  maxWidth: "480px",
                }}
              >
                Align your brand with elegance, reach a global audience of 4M+, and support a
                movement that empowers people worldwide.
              </p>
            </div>
            <SponsorButton onOpen={() => setModalOpen(true)} />
          </div>
        </div>
      </div>

      {modalOpen && <PartnerModal onClose={() => setModalOpen(false)} />}

      <style>{`
        @media (max-width: 900px) {
          .franchise-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sponsor-cta { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .franchise-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
