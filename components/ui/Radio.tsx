import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioProps {
  label: string;
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  layout?: "vertical" | "horizontal" | "cards";
  required?: boolean;
}

export function Radio({
  label,
  name,
  options,
  value,
  onChange,
  error,
  layout = "vertical",
  required,
}: RadioProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-sm font-medium font-sans text-warm-charcoal">
        {label}
        {required && <span className="text-[var(--color-gold-deep)] ml-0.5">*</span>}
      </legend>
      <div
        className={cn(
          layout === "horizontal" && "flex flex-wrap gap-3",
          layout === "vertical" && "flex flex-col gap-2",
          layout === "cards" && "grid grid-cols-1 sm:grid-cols-2 gap-2"
        )}
      >
        {options.map((opt) => {
          const id = `${name}-${opt.value}`;
          const checked = value === opt.value;
          if (layout === "cards") {
            return (
              <label
                key={opt.value}
                htmlFor={id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 rounded-brand border-2 cursor-pointer transition-colors",
                  checked
                    ? "border-[var(--color-gold)] bg-[var(--color-gold-50)]"
                    : "border-warm-border bg-white hover:border-[var(--color-gold-300)]"
                )}
              >
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={checked}
                  onChange={(e) => onChange(e.target.value)}
                  className="mt-0.5 w-4 h-4 accent-[var(--color-gold)] cursor-pointer"
                />
                <span>
                  <span className="block text-sm font-semibold text-warm-charcoal">
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="block text-xs text-[var(--color-ink-secondary)] mt-0.5">
                      {opt.description}
                    </span>
                  )}
                </span>
              </label>
            );
          }
          return (
            <label key={opt.value} htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer">
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 accent-[var(--color-gold)] cursor-pointer"
              />
              <span className="text-sm font-sans text-warm-charcoal">{opt.label}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500 font-sans">{error}</p>}
    </fieldset>
  );
}
