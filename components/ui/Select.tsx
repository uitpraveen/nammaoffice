import { cn } from "@/lib/utils";
import { SelectHTMLAttributes } from "react";

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
  /**
   * Either a flat list of options or a list of grouped options. Groups
   * render as native <optgroup>, which on iOS/Android shows the group
   * label as a non-selectable separator — nicer than padding labels.
   */
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
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={selectId}
        className="text-sm font-medium font-sans text-warm-charcoal"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "rounded-brand border border-warm-border bg-white px-4 py-2.5 text-base font-sans text-warm-charcoal",
          "focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta",
          "transition-colors duration-200 cursor-pointer",
          props.disabled && "opacity-70 cursor-not-allowed bg-warm-cream/40",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
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
      {hint && !error && (
        <p className="text-xs text-warm-charcoal/60 font-sans">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-500 font-sans">{error}</p>
      )}
    </div>
  );
}
