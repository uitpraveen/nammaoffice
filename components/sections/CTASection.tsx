import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { whatsappUrl } from "@/lib/utils";

export function CTASection() {
  return (
    <section className="bg-[var(--color-navy)] relative overflow-hidden">
      {/* Soft gold radial accent — single static layer */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            "radial-gradient(45% 60% at 80% 50%, rgba(232,181,71,0.22), transparent 60%), radial-gradient(40% 40% at 0% 100%, rgba(232,181,71,0.12), transparent 60%)",
        }}
      />

      <div className="content-width relative z-10 py-20 md:py-28 flex flex-col items-center text-center">
        <p className="eyebrow !text-[var(--color-gold-300)]">Ready when you are</p>
        <h2 className="display-xl mt-4 max-w-3xl text-white">
          Find your space.
          <br />
          <span className="text-[var(--color-gold-300)] italic font-normal">
            Start working tomorrow.
          </span>
        </h2>
        <p className="mt-6 text-[16px] md:text-[17px] text-white/70 max-w-xl leading-relaxed">
          Book a tour at any centre. Walk through the spaces, meet the team, and pick the seat that fits.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/bookings"
            className="group relative inline-flex items-center gap-2 h-12 px-6 bg-[var(--color-gold)] text-[var(--color-navy-deep)] text-[14px] font-semibold rounded-full transition-transform hover:scale-[1.03] hover:bg-[var(--color-gold-deep)] hover:text-white shadow-[var(--shadow-cta)]"
          >
            Book a free tour
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
          </Link>
          <a
            href={whatsappUrl(
              BRAND.whatsapp,
              "Hi, I'm interested in a NammaOffice workspace"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-6 border border-white/25 bg-white/[0.04] backdrop-blur text-white text-[14px] font-semibold rounded-full hover:bg-white/[0.10] hover:border-white/50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={2} />
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}
