import { getPublicContent } from "@/lib/cms/public";
export async function Testimonials() {
  const { testimonials } = await getPublicContent();
  if (!testimonials.length) return null;
  return (
    <section
      className="content-width py-16 md:py-24"
      aria-labelledby="testimonials-title"
    >
      <p className="eyebrow">Our community</p>
      <h2 id="testimonials-title" className="display mt-3 text-3xl md:text-5xl">
        What our clients say
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className="flex flex-col rounded-2xl border hairline bg-[var(--card)] p-6"
          >
            <blockquote className="flex-1 whitespace-pre-wrap break-words text-lg leading-relaxed">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 border-t hairline pt-4">
              <p className="font-semibold">{t.name}</p>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                {[t.role, t.company].filter(Boolean).join(" · ")}
              </p>
              {t.centre && (
                <p className="mt-1 text-xs text-[var(--ink-muted)]">
                  {t.centre}
                </p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
