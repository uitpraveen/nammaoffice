/**
 * Mobile-collapsible form section. On <md the section renders as a
 * native <details> accordion so long forms scan better; on md+ it pins
 * open and renders like a regular fieldset. No client JS - works inside
 * server components too.
 */
export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className="group md:open border border-[var(--color-border)] md:border-0 rounded-2xl md:rounded-none p-4 md:p-0 bg-white md:bg-transparent"
    >
      <summary
        className="flex items-center justify-between md:cursor-default list-none [&::-webkit-details-marker]:hidden md:pointer-events-none md:pb-4 md:border-b md:border-[var(--color-border)]"
      >
        <div>
          <h3 className="font-display text-[18px] md:text-[22px] text-[var(--color-navy)] tracking-[-0.01em] leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-[13px] text-[var(--color-ink-secondary)] mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        <svg
          className="md:hidden w-4 h-4 text-[var(--color-ink-secondary)] transition-transform duration-200 group-open:rotate-180 shrink-0 ml-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <fieldset className="space-y-5 mt-5 md:mt-6">{children}</fieldset>
    </details>
  );
}
