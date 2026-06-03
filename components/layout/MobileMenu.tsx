"use client";

import { navigation } from "@/lib/data/navigation";
import { BRAND } from "@/lib/constants";
import { cn, formatPhone, whatsappUrl } from "@/lib/utils";
import { useActiveHref } from "@/lib/hooks/use-active-href";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Mail, MessageCircle, Phone, X } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  // Close on route change. Stash onClose in a ref so the effect can call the
  // latest callback without depending on it (parent recreates it every render,
  // and including it in deps would close the menu the instant it opens).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    onCloseRef.current();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close the menu when any link inside it is tapped. Runs in window's
  // capture phase so it fires BEFORE SmoothScroll's document-level
  // anchor interceptor — that handler calls `stopImmediatePropagation`
  // for in-page hash links (/#about, /#amenities, Home-on-Home), which
  // would otherwise prevent React's onClick (and therefore onClose)
  // from ever firing.
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const onCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !menuRef.current?.contains(target)) return;
      if (!target.closest("a")) return;
      document.body.style.overflow = "";
      onCloseRef.current();
    };
    window.addEventListener("click", onCapture, { capture: true });
    return () => window.removeEventListener("click", onCapture, { capture: true });
  }, [isOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={menuRef}
        className={cn(
          "fixed inset-y-0 right-0 w-full max-w-[420px] bg-white z-50 lg:hidden",
          "transition-transform duration-300 ease-out flex flex-col",
          "shadow-[0_0_60px_rgba(0,0,0,0.15)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--color-border)]">
          <Link href="/" className="inline-flex items-center" aria-label="NammaOffice home">
            <Image
              src="/images/logo.png"
              alt="NammaOffice"
              width={2102}
              height={358}
              className="h-7 w-auto"
            />
          </Link>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
          {navigation.map((item) => {
            if (item.children) {
              const isExpanded = openAccordion === item.href;
              const isParentActive =
                pathname === item.href ||
                pathname.startsWith(item.href + "/") ||
                item.children.some(
                  (c) => pathname === c.href || pathname.startsWith(c.href + "/")
                );
              return (
                <div key={item.href} className="mb-0.5">
                  <button
                    onClick={() => setOpenAccordion(isExpanded ? null : item.href)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-semibold transition-colors",
                      isParentActive
                        ? "text-[var(--color-accent-700)] bg-[var(--color-accent-50)]"
                        : "text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200 opacity-60",
                        isExpanded && "rotate-180 opacity-100"
                      )}
                      strokeWidth={2}
                    />
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isExpanded ? "max-h-[600px] opacity-100 mt-1" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-3 pl-3 border-l border-[var(--color-border)] space-y-0.5 pb-2">
                      {item.children.map((child) => (
                        <MobileChildLink
                          key={child.href}
                          href={child.href}
                          label={child.label}
                          description={child.description}
                          pathname={pathname}
                          onClose={onClose}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <MobileLeafLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
                onClose={onClose}
              />
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-[var(--color-border)] space-y-3 bg-[var(--color-bg)]">
          <Link
            href="/bookings"
            className="flex items-center justify-center gap-2 w-full h-12 bg-[var(--color-gold)] text-[var(--color-navy-deep)] text-[14px] font-semibold rounded-full hover:bg-[var(--color-gold-deep)] hover:text-white transition-colors shadow-[var(--shadow-cta)]"
          >
            Book Now <span aria-hidden>→</span>
          </Link>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="flex items-center justify-center gap-1.5 h-11 rounded-full border border-[var(--color-border)] text-[12.5px] font-semibold text-[var(--color-ink)] hover:bg-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" strokeWidth={2} /> Call
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="flex items-center justify-center gap-1.5 h-11 rounded-full border border-[var(--color-border)] text-[12.5px] font-semibold text-[var(--color-ink)] hover:bg-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" strokeWidth={2} /> Email
            </a>
            <a
              href={whatsappUrl(BRAND.whatsapp, "Hi, I'm interested in NammaOffice workspaces")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 h-11 rounded-full bg-[#25D366] text-white text-[12.5px] font-semibold hover:bg-[#1ebe5a] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.25} /> Chat
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Synchronously restore body scroll BEFORE the click bubbles to SmoothScroll's
 * anchor handler. The menu's `overflow: hidden` lock would otherwise still be
 * applied when Lenis tries to scroll to a `/#section` anchor, leaving the
 * menu closed but the page parked at the top.
 */
function handleMenuLinkClick(onClose: () => void) {
  return () => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
    onClose();
  };
}

function MobileLeafLink({
  href,
  label,
  pathname,
  onClose,
}: {
  href: string;
  label: string;
  pathname: string;
  onClose: () => void;
}) {
  const isActive = useActiveHref(href, pathname);
  return (
    <Link
      href={href}
      onClick={handleMenuLinkClick(onClose)}
      className={cn(
        "block px-3 py-3 rounded-xl text-[15px] font-semibold transition-colors mb-0.5",
        isActive
          ? "text-[var(--color-accent-700)] bg-[var(--color-accent-50)]"
          : "text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]"
      )}
    >
      {label}
    </Link>
  );
}

function MobileChildLink({
  href,
  label,
  description,
  pathname,
  onClose,
}: {
  href: string;
  label: string;
  description?: string;
  pathname: string;
  onClose: () => void;
}) {
  const isActive = useActiveHref(href, pathname);
  return (
    <Link
      href={href}
      onClick={handleMenuLinkClick(onClose)}
      className={cn(
        "block px-3 py-2.5 rounded-lg transition-colors",
        isActive ? "bg-[var(--color-accent-50)]" : "hover:bg-[var(--color-surface-alt)]"
      )}
    >
      <span
        className={cn(
          "block text-[14px] font-semibold leading-tight",
          isActive ? "text-[var(--color-accent-700)]" : "text-[var(--color-ink)]"
        )}
      >
        {label}
      </span>
      {description && (
        <span className="block text-[12.5px] text-[var(--color-ink-secondary)] mt-0.5">
          {description}
        </span>
      )}
    </Link>
  );
}
