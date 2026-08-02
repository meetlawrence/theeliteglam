"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Ticket, UserPlus, Star } from "lucide-react";
import { NavCta } from "@/app/components/ui/NavCta";

const LOGO_PATH = "/logo.svg";

const NAV_LINKS = [
  { label: "Home", page: "/" },
  { label: "Events", page: "/events" },
  { label: "About", page: "/about" },
  { label: "Contestants", page: "/contestants" },
  { label: "Blog", page: "/blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [menuOpen]);

  // Helper to close menu and navigate
  const handleNav = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };


  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        menuOpen
          ? "bg-black border-[#C9A84C]/20"
          : scrolled
          ? "bg-black/96 border-[#C9A84C]/20"
          : "bg-black/35 border-[#C9A84C]/20"
      } backdrop-blur-md`}
    >
      <div className="max-w-350 mx-auto px-8 h-19.5 flex items-center justify-between relative z-50">
        {/* Logo */}
        <button onClick={() => handleNav("/")} className="flex items-center shrink-0">
          <Image
            src={LOGO_PATH}
            alt="Elite Glam"
            width={80}
            height={34}
            className="mix-blend-screen"
          />
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, page }) => {
            const isActive = pathname === page;
            return (
              <button
                key={label}
                onClick={() => router.push(page)}
                className={`font-raleway text-xs tracking-[0.18em] uppercase transition-colors relative ${
                  isActive ? "text-accent" : "text-muted-foreground hover:text-[#C9A84C]"
                }`}
              >
                {label}
                {isActive && (
                  <div className="absolute -bottom-2 left-0 w-full h-px bg-linear-to-r from-transparent via-accent to-transparent" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <NavCta label="Tickets" icon={<Ticket size={13} />} variant="ghost" onClick={() => handleNav("/tickets")} />
          <NavCta label="Register" icon={<UserPlus size={13} />} variant="ghost" onClick={() => handleNav("/register")} />
          <NavCta label="Vote" icon={<Star size={13} />} variant="filled" onClick={() => handleNav("/contestants")} />
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 border border-[#C9A84C]/30 text-[#C9A84C]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-19.5 left-0 w-full bg-black/98 border-b border-[#C9A84C]/20 p-6 flex flex-col gap-10 animate-[fadeInUp_600ms_ease-out]">
          {NAV_LINKS.map(({ label, page }, index) => {
            const isActive = pathname === page;
            return (
              <button
                key={label}
                onClick={() => handleNav(page)}
                className={`relative text-center uppercase tracking-widest text-sm py-2 border-b border-[#C9A84C]/10 transition-all duration-200 ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`}
                style={{ animationDelay: `${index * 180}ms` }}
              >
                {label}

                {isActive && (
                  <div className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
                )}
              </button>
            );
          })}

          {/* Mobile CTA Buttons */}
          <div className="flex flex-row flex-wrap gap-3 justify-center" style={{ animationDelay: `${NAV_LINKS.length * 180}ms` }}>
            <NavCta label="Tickets" icon={<Ticket size={13} />} variant="ghost" onClick={() => handleNav("/tickets")} />
            <NavCta label="Register" icon={<UserPlus size={13} />} variant="ghost" onClick={() => handleNav("/register")} />
            <NavCta label="Vote" icon={<Star size={13} />} variant="filled" onClick={() => handleNav("/contestants")} />
          </div>
        </div>
      )}
    </nav>
  );
}
