import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
  const groupId = `${name}-label`;
  return (
    <div role="group" aria-labelledby={groupId}>
      <p
        id={groupId}
        className="text-[13px] font-semibold font-sans text-warm-charcoal tracking-[-0.005em] mb-3"
      >
        {label}
        {required && <span className="text-[var(--color-gold-deep)] ml-0.5">*</span>}
      </p>
      <div
        className={cn(
          layout === "horizontal" && "flex flex-wrap gap-3",
          layout === "vertical" && "flex flex-col gap-2",
          layout === "cards" && "grid grid-cols-1 sm:grid-cols-2 gap-3",
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
                  "relative flex items-start gap-3 px-4 py-3.5 rounded-brand border-2 cursor-pointer transition-all duration-150",
                  checked
                    ? "border-[var(--color-gold)] bg-[var(--color-gold-50)] shadow-[0_2px_8px_-3px_rgba(184,85,58,0.30)]"
                    : "border-warm-border bg-[#fbfaf6] hover:border-[var(--color-gold-300)] hover:bg-white",
                )}
              >
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={checked}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "mt-0.5 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full border shrink-0 transition-colors",
                    checked
                      ? "bg-[var(--color-gold)] border-[var(--color-gold)]"
                      : "bg-white border-warm-border",
                  )}
                >
                  <Check
                    className={cn(
                      "w-3 h-3 text-white transition-opacity",
                      checked ? "opacity-100" : "opacity-0",
                    )}
                    strokeWidth={3.5}
                  />
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block text-[14px] font-semibold transition-colors",
                      checked
                        ? "text-[var(--color-gold-deep)]"
                        : "text-warm-charcoal",
                    )}
                  >
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="block text-[12.5px] text-[var(--color-ink-secondary)] mt-1 leading-snug">
                      {opt.description}
                    </span>
                  )}
                </span>
              </label>
            );
          }
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className="inline-flex items-center gap-2 cursor-pointer group"
            >
              <span className="relative inline-flex items-center justify-center">
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={checked}
                  onChange={(e) => onChange(e.target.value)}
                  className="peer appearance-none w-[18px] h-[18px] rounded-full border border-warm-border bg-white cursor-pointer transition-colors checked:border-[var(--color-gold)] hover:border-[var(--color-gold-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-1"
                />
                <span className="pointer-events-none absolute w-2 h-2 rounded-full bg-[var(--color-gold)] opacity-0 peer-checked:opacity-100 transition-opacity" />
              </span>
              <span className="text-[14px] font-sans text-warm-charcoal">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && <p className="text-[13px] text-red-500 font-sans mt-2">{error}</p>}
    </div>
  );
}
