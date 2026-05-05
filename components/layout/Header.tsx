"use client";

import { BRAND } from "@/lib/constants";
import { cn, formatPhone } from "@/lib/utils";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, Star } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Floating glass navbar — Linear / Vercel style.
 *
 * Layout:
 *   - 28px charcoal top strip with social-proof rating + phone number
 *   - Floating pill below it (12px gap), frosted glass, holds logo + nav + CTA
 *
 * Behaviour:
 *   - Over hero (home, before scroll): translucent dark glass with white text
 *   - On scroll / on inner pages: solid white glass with charcoal text
 */
export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const overHero = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top strip — minimal, charcoal */}
      <div className="fixed top-0 left-0 right-0 z-40 h-7 md:h-8 bg-[var(--color-charcoal)] text-white text-[11px] md:text-[12px] font-medium">
        <div className="content-width h-full flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-white/85">
            <Star className="w-3 h-3 fill-[var(--color-gold)] text-[var(--color-gold)]" strokeWidth={1.5} />
            <span className="font-semibold text-white">4.9</span>
            <span className="hidden sm:inline">/ 5 from 200+ members</span>
            <span className="hidden sm:inline opacity-30">·</span>
            <span className="hidden sm:inline text-white/70">8 centres · 3 cities</span>
          </span>
          <a
            href={`tel:${formatPhone(BRAND.phone)}`}
            className="inline-flex items-center gap-1.5 text-white/85 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3" strokeWidth={2} />
            <span className="font-semibold text-white">{BRAND.phone}</span>
          </a>
        </div>
      </div>

      {/* Floating pill nav */}
      <header className="fixed top-7 md:top-8 left-0 right-0 z-40 pt-3">
        <div className="content-width">
          <div
            className={cn(
              "h-14 md:h-16 px-2 md:px-3 rounded-full transition-all duration-300",
              "border backdrop-blur-xl",
              overHero
                ? "bg-black/30 border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
                : "bg-white/85 border-[var(--color-border)] shadow-[0_8px_24px_rgba(14,14,16,0.08)]"
            )}
          >
            <div className="h-full flex items-center justify-between gap-3 pl-3 pr-1.5 md:pl-4 md:pr-2">
              <Link
                href="/"
                className="inline-flex items-center shrink-0"
                aria-label="NammaOffice — home"
              >
                <Image
                  src="/images/logo.png"
                  alt="NammaOffice"
                  width={1000}
                  height={137}
                  priority
                  className={cn(
                    "h-6 sm:h-7 lg:h-7 w-auto transition-[filter] duration-200",
                    overHero ? "brightness-0 invert" : ""
                  )}
                />
              </Link>

              <DesktopNav theme={overHero ? "light" : "dark"} />

              <div className="flex items-center gap-1.5">
                <Link
                  href="/bookings"
                  className={cn(
                    "hidden lg:inline-flex items-center gap-1.5 h-10 px-5 text-[13px] font-semibold rounded-full transition-all",
                    "bg-[var(--color-gold)] text-[var(--color-navy-deep)] hover:bg-[var(--color-gold-deep)] hover:text-white",
                    "shadow-[var(--shadow-cta)] hover:shadow-[var(--shadow-cta-hover)]"
                  )}
                >
                  Book Now
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className={cn(
                    "lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full transition-colors",
                    overHero
                      ? "text-white hover:bg-white/15 active:bg-white/25"
                      : "text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] active:bg-[var(--color-border)]"
                  )}
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Spacer for non-home pages — top strip (28/32px) + pill area (~76px) */}
      {!isHome && <div className="h-[calc(28px+76px)] md:h-[calc(32px+80px)]" aria-hidden />}
    </>
  );
}
