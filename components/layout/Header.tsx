"use client";

import { BRAND } from "@/lib/constants";
import { cn, formatPhone } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-warm-white/97 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        )}
      >
        {/* ── NOT SCROLLED: Two-row elegant layout ── */}
        <div
          className={cn(
            "transition-all duration-500 overflow-hidden",
            scrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
          )}
        >
          <div className="content-width h-20 flex items-center justify-between">
            {/* Left: phone */}
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="hidden lg:flex items-center gap-2 text-xs font-medium tracking-[0.1em] uppercase text-white/70 hover:text-white transition-colors duration-300"
            >
              <PhoneIcon className="w-3.5 h-3.5" />
              {BRAND.phone}
            </a>

            {/* Center: logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0"
              aria-label="NammaOffice home"
            >
              <span className="font-serif text-[28px] font-semibold tracking-[0.2em] text-white transition-colors duration-300">
                NAMMA<span className="text-terracotta-300">OFFICE</span>
              </span>
              <span className="text-[9px] font-sans font-medium tracking-[0.35em] uppercase text-white/40">
                Premium Coworking
              </span>
            </Link>

            {/* Right: CTA + hamburger */}
            <div className="flex items-center gap-3">
              <Button href="/book-tour" variant="primary" size="sm" className="hidden lg:inline-flex">
                Book a Tour
              </Button>
              <HamburgerButton
                onClick={() => setMobileMenuOpen(true)}
                light={true}
                open={mobileMenuOpen}
              />
            </div>
          </div>

          {/* Nav row */}
          <div className="hidden lg:flex justify-center border-t border-white/10">
            <DesktopNav light={true} />
          </div>
        </div>

        {/* ── SCROLLED: Single compact row ── */}
        <div
          className={cn(
            "transition-all duration-500 overflow-hidden",
            scrolled ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="content-width h-16 flex items-center justify-between">
            {/* Logo left */}
            <Link
              href="/"
              className="font-serif text-xl font-semibold tracking-[0.15em] text-warm-charcoal transition-colors duration-300"
              aria-label="NammaOffice home"
            >
              NAMMA<span className="text-terracotta">OFFICE</span>
            </Link>

            {/* Nav center */}
            <DesktopNav light={false} />

            {/* Right: phone + CTA */}
            <div className="flex items-center gap-4">
              <a
                href={`tel:${formatPhone(BRAND.phone)}`}
                className="hidden xl:flex items-center gap-2 text-xs font-medium tracking-[0.08em] uppercase text-warm-charcoal/70 hover:text-terracotta transition-colors duration-300"
              >
                <PhoneIcon className="w-3.5 h-3.5" />
                {BRAND.phone}
              </a>
              <Button href="/book-tour" variant="primary" size="sm" className="hidden lg:inline-flex">
                Book a Tour
              </Button>
              <HamburgerButton
                onClick={() => setMobileMenuOpen(true)}
                light={false}
                open={mobileMenuOpen}
              />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 16.352V17.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function HamburgerButton({
  onClick,
  light,
  open,
}: {
  onClick: () => void;
  light: boolean;
  open: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "lg:hidden p-2 rounded-xl transition-colors duration-300",
        light ? "text-white hover:bg-white/10" : "text-warm-charcoal hover:bg-sand"
      )}
      aria-label="Open menu"
      aria-expanded={open}
    >
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="3" y1="6.5" x2="21" y2="6.5" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="17.5" x2="21" y2="17.5" />
      </svg>
    </button>
  );
}
