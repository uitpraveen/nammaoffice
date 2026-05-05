import { clients } from "@/lib/data/clients";

export function ClientLogos() {
  // Duplicate for seamless infinite scroll
  const doubled = [...clients, ...clients];

  return (
    <section className="bg-white border-y border-[var(--color-border)] py-14 overflow-hidden">
      <div className="content-width mb-8">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          Trusted by teams across Tamil Nadu
        </p>
      </div>

      {/* Edge fade mask */}
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10"
        />

        <div
          className="flex gap-12 w-max items-center"
          style={{ animation: "logo-scroll 35s linear infinite" }}
        >
          {doubled.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="shrink-0 flex items-center justify-center min-w-[140px] h-9"
              title={client.name}
            >
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors whitespace-nowrap">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
