"use client";

import { navigation } from "@/lib/data/navigation";
import { BRAND } from "@/lib/constants";
import { cn, formatPhone, whatsappUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[340px] max-w-[90vw] bg-warm-white z-50 lg:hidden",
          "transition-transform duration-300 ease-in-out flex flex-col",
          "shadow-[0_0_60px_rgba(0,0,0,0.15)]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm-border">
          <Link href="/" className="font-serif text-xl tracking-[0.1em] text-warm-charcoal">
            NAMMA<span className="text-terracotta">OFFICE</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-warm-charcoal hover:bg-sand transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Mobile navigation">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"));

            if (item.children) {
              const isExpanded = openAccordion === item.href;
              return (
                <div key={item.href} className="mb-1">
                  <button
                    onClick={() => setOpenAccordion(isExpanded ? null : item.href)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold uppercase tracking-[0.08em] transition-colors",
                      isActive
                        ? "text-terracotta bg-terracotta/5"
                        : "text-warm-charcoal hover:bg-sand"
                    )}
                  >
                    {item.label}
                    <svg
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded ? "rotate-180" : ""
                      )}
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Expanded children with descriptions */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isExpanded ? "max-h-[600px] opacity-100 mt-1" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-2 border-l-2 border-terracotta/20 pl-3 space-y-0.5 pb-2">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-3 py-2.5 rounded-xl transition-colors",
                              isChildActive ? "bg-terracotta/5" : "hover:bg-sand"
                            )}
                          >
                            <span
                              className={cn(
                                "block text-sm font-medium transition-colors",
                                isChildActive
                                  ? "text-terracotta"
                                  : "text-warm-charcoal"
                              )}
                            >
                              {child.label}
                            </span>
                            <span className="block text-xs text-warm-gray/70 mt-0.5 leading-relaxed">
                              {child.description}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-3 rounded-xl text-sm font-semibold uppercase tracking-[0.08em] transition-colors mb-1",
                  isActive
                    ? "text-terracotta bg-terracotta/5"
                    : "text-warm-charcoal hover:bg-sand"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-5 py-5 border-t border-warm-border space-y-3">
          <Button href="/book-tour" variant="primary" className="w-full">
            Book a Tour
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${formatPhone(BRAND.phone)}`}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-warm-border text-sm font-medium text-warm-charcoal hover:bg-sand transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 16.352V17.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Call Us
            </a>
            <a
              href={whatsappUrl(BRAND.whatsapp, "Hi, I'm interested in NammaOffice workspaces")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
