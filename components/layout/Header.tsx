"use client";

import { BRAND } from "@/lib/constants";
import { cn, formatPhone } from "@/lib/utils";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Clock, Mail, MapPin, Menu, Phone, Star } from "lucide-react";
import { useState } from "react";

/**
 * Newspaper-Masthead navbar v2 — bold matt black with neon brick rule.
 *  1. 32px utility strip — rating · centres · hours on the left;
 *     email · phone on the right.
 *  2. 80px solid matt-black masthead — large logo, Fraunces uppercase
 *     serif nav, full-height brick BOOK NOW tile flush on the far right.
 *  3. Thin neon brick rule beneath the masthead with a soft glow halo
 *     for the "royal & promising" feel.
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40">
        {/* Utility strip — richer info: rating · centres · hours · email · phone */}
        <div className="h-8 bg-[var(--color-charcoal)] text-white text-[11px] font-medium border-b border-white/5">
          <div className="content-width h-full flex items-center justify-between gap-3">
            {/* Left cluster — public-trust signals */}
            <div className="flex items-center gap-x-3 lg:gap-x-4 text-white/80 min-w-0">
              <span className="inline-flex items-center gap-1 shrink-0">
                <Star className="w-3 h-3 fill-[var(--color-gold)] text-[var(--color-gold)]" strokeWidth={1.5} />
                <span className="font-semibold text-white">4.9</span>
                <span className="hidden sm:inline ml-1">/5 · 200+ members</span>
              </span>
              <span className="hidden md:inline opacity-30">·</span>
              <span className="hidden md:inline-flex items-center gap-1 shrink-0">
                <MapPin className="w-2.5 h-2.5" strokeWidth={2} />
                8 centres · 3 cities
              </span>
              <span className="hidden lg:inline opacity-30">·</span>
              <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                <Clock className="w-2.5 h-2.5" strokeWidth={2} />
                Mon–Sat 8 AM – 9 PM
              </span>
            </div>

            {/* Right cluster — direct contact */}
            <div className="flex items-center gap-x-3 lg:gap-x-4 shrink-0">
              <a
                href={`mailto:${BRAND.email}`}
                className="hidden md:inline-flex items-center gap-1 text-white/80 hover:text-[var(--color-gold-300)] transition-colors"
              >
                <Mail className="w-2.5 h-2.5" strokeWidth={2} />
                {BRAND.email}
              </a>
              <span className="hidden md:inline opacity-30">·</span>
              <a
                href={`tel:${formatPhone(BRAND.phone)}`}
                className="inline-flex items-center gap-1 text-white/85 hover:text-[var(--color-gold-300)] transition-colors"
              >
                <Phone className="w-3 h-3" strokeWidth={2} />
                <span className="font-semibold text-white">{BRAND.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Masthead bar — solid matt black */}
        <div className="h-16 md:h-20 bg-[var(--color-navy)] text-white relative">
          <div className="content-width h-full flex items-stretch justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center shrink-0 py-2"
              aria-label="NammaOffice — home"
            >
              <Image
                src="/images/logo.png"
                alt="NammaOffice"
                width={1000}
                height={137}
                priority
                className="h-6 md:h-7 w-auto brightness-0 invert"
              />
            </Link>

            {/* Center nav — Fraunces uppercase, evenly spaced */}
            <div className="flex-1 flex items-center justify-center min-w-0">
              <DesktopNav />
            </div>

            {/* Right cluster — desktop CTA tile + mobile menu button */}
            <div className="flex items-stretch shrink-0">
              <Link
                href="/bookings"
                className={cn(
                  "hidden lg:inline-flex items-center justify-center gap-1.5 h-full px-6 whitespace-nowrap",
                  "bg-[var(--color-gold)] text-white hover:bg-[var(--color-gold-deep)]",
                  "transition-colors",
                  "text-[11.5px] font-bold uppercase tracking-[0.18em] font-[var(--font-serif)]"
                )}
              >
                Book Now
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden inline-flex items-center justify-center w-12 self-center h-12 mr-1 text-white hover:bg-white/10 active:bg-white/20 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Gold hairline + travelling comet of light. The hairline is the
              static rule beneath the masthead; the comet is a brighter gold
              teardrop with a fading tail and a soft glow ring, sweeping
              across on a ~4.5s loop. */}
          <span
            aria-hidden
            className="absolute left-0 right-0 -bottom-px h-px bg-[var(--color-gold)]"
          />
          <span
            aria-hidden
            className="absolute -bottom-px left-0 right-0 h-px overflow-hidden pointer-events-none"
          >
            <span
              className="header-light-sweep block h-px w-[26%] min-w-[180px] max-w-[360px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(232,162,107,0.45) 55%, rgba(255,215,150,1) 90%, transparent 100%)",
                boxShadow: "0 0 6px 0.5px rgba(255,215,150,0.85)",
              }}
            />
          </span>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Spacer for non-home pages — utility strip + masthead height */}
      {!isHome && <div className="h-[calc(32px+64px)] md:h-[calc(32px+80px)]" aria-hidden />}
    </>
  );
}
