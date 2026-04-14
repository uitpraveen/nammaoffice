import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-[#2D2926] via-[#3D3833] to-[#2D2926] relative overflow-hidden">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-5"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="content-width relative z-10 flex flex-col items-center text-center gap-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
            Ready to Find Your Perfect Workspace?
          </h2>
          <p className="font-sans text-lg text-white/80">
            Join 500+ professionals already working smarter at NammaOffice.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/contact?type=tour" variant="secondary" size="lg">
            Book a Tour
          </Button>
          <Button
            href="/contact"
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-warm-charcoal"
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </section>
  );
}
