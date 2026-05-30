import { cn } from "@/lib/utils";
import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[] | SelectOptionGroup[];
  placeholder?: string;
  error?: string;
  hint?: string;
  className?: string;
}

export function Select({
  label,
  options,
  placeholder,
  error,
  hint,
  className,
  id,
  required,
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={selectId}
        className="text-[13px] font-semibold font-sans text-warm-charcoal tracking-[-0.005em]"
      >
        {label}
        {required && <span className="text-[var(--color-gold-deep)] ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          className={cn(
            "w-full appearance-none rounded-brand border border-warm-border bg-[#fbfaf6] px-4 pr-11 py-3.5 text-[15px] font-sans text-warm-charcoal",
            "hover:bg-white hover:border-warm-charcoal/25",
            "focus:outline-none focus:bg-white focus:border-warm-charcoal/35 focus:shadow-[0_0_0_4px_rgba(184,85,58,0.10)]",
            "transition-all duration-200 cursor-pointer",
            !props.value && "text-warm-charcoal/45",
            props.disabled && "opacity-70 cursor-not-allowed bg-warm-cream/40 hover:bg-warm-cream/40",
            error &&
              "border-red-400 bg-red-50/30 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.10)]",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((entry) => {
            if ("options" in entry) {
              return (
                <optgroup key={entry.label} label={entry.label}>
                  {entry.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              );
            }
            return (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-charcoal/45"
          strokeWidth={2}
        />
      </div>
      {hint && !error && (
        <p className="text-[12px] text-warm-charcoal/60 font-sans leading-relaxed">{hint}</p>
      )}
      {error && <p className="text-[13px] text-red-500 font-sans">{error}</p>}
    </div>
  );
}
