import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { workspaces } from "@/lib/data/workspaces";
import { noImageUrl, workspacePhotos } from "@/lib/data/nammaoffice-images";

export function WorkspaceCardsGrid() {
  return (
    <section className="section-padding bg-[var(--color-bg)]">
      <div className="content-width">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <p className="eyebrow">Spaces</p>
            <h2 className="display-lg mt-3 text-[var(--color-ink)]">
              Six space types.
              <br />
              <span className="text-[var(--color-ink-secondary)]">One that fits how you work.</span>
            </h2>
          </div>
          <Link
            href="/workspaces"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors self-start"
          >
            Compare all spaces
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.25} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {workspaces.map((ws) => {
            const img = workspacePhotos[ws.slug];
            return (
              <Link
                key={ws.slug}
                href={`/workspaces/${ws.slug}`}
                className="group relative block bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-[0_8px_24px_rgba(10,10,10,0.06)] transition-all"
              >
                <div className="relative aspect-[4/3] bg-[var(--color-surface-alt)] overflow-hidden">
                  {img && (
                    <Image
                      src={noImageUrl(img)}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm text-[var(--color-ink)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.25} />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                      {ws.name}
                    </h3>
                    <span className="shrink-0 text-[12px] font-medium text-[var(--color-ink-muted)]">
                      {ws.capacity}
                    </span>
                  </div>
                  <p className="text-[13.5px] text-[var(--color-ink-secondary)] leading-relaxed line-clamp-2">
                    {ws.shortDescription}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)]">
                    Explore
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.25} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
