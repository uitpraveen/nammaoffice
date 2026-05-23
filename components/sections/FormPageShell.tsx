import { ReactNode } from "react";
import { HeroBanner } from "@/components/sections/HeroBanner";

interface FormPageShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  intro?: string;
  children: ReactNode;
  /** Sidebar content shown on desktop (≥ lg). Optional. */
  aside?: ReactNode;
}

export function FormPageShell({
  eyebrow,
  title,
  subtitle,
  intro,
  children,
  aside,
}: FormPageShellProps) {
  return (
    <>
      <HeroBanner eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <section className="content-width py-12 md:py-16">
        <div className={aside ? "grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12" : ""}>
          <div>
            {intro && (
              <p className="text-[15px] text-[var(--color-ink-secondary)] leading-relaxed mb-8 max-w-2xl">
                {intro}
              </p>
            )}
            <div className="rounded-2xl bg-white border border-[var(--color-border)] shadow-[var(--shadow-brand)] p-6 md:p-10 lg:p-12">
              {children}
            </div>
          </div>
          {aside && (
            <aside className="hidden lg:block">
              <div className="sticky top-32">{aside}</div>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
