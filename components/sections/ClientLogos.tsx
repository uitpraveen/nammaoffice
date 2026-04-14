import { clients } from "@/lib/data/clients";

export function ClientLogos() {
  // Duplicate for seamless infinite scroll
  const doubled = [...clients, ...clients];

  return (
    <section className="py-12 bg-sand border-y border-warm-border overflow-hidden">
      <div className="content-width mb-8">
        <p className="text-center text-sm uppercase tracking-wider text-warm-gray font-sans">
          Trusted By
        </p>
      </div>

      {/* Scrolling strip */}
      <div className="relative overflow-hidden">
        <div
          className="flex gap-10 w-max"
          style={{ animation: "logo-scroll 30s linear infinite" }}
        >
          {doubled.map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex items-center justify-center shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              title={client.name}
            >
              {/* Placeholder rectangle with company name */}
              <div className="h-10 px-5 bg-white rounded border border-warm-border flex items-center justify-center min-w-[120px]">
                <span className="font-sans text-xs font-medium text-warm-charcoal whitespace-nowrap">
                  {client.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
