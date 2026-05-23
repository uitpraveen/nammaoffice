import { cn } from "@/lib/utils";
import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Optional icon shown inside the input on the left. */
  leftIcon?: ReactNode;
  className?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  className,
  id,
  required,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className="text-[13px] font-semibold font-sans text-warm-charcoal tracking-[-0.005em]"
      >
        {label}
        {required && <span className="text-[var(--color-gold-deep)] ml-0.5">*</span>}
      </label>
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-charcoal/40">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          required={required}
          className={cn(
            "w-full rounded-brand border border-warm-border bg-[#fbfaf6] py-3.5 text-[15px] font-sans text-warm-charcoal",
            leftIcon ? "pl-10 pr-4" : "px-4",
            "placeholder:text-warm-charcoal/40",
            "hover:bg-white hover:border-warm-charcoal/25",
            "focus:outline-none focus:bg-white focus:border-warm-charcoal/35 focus:shadow-[0_0_0_4px_rgba(184,85,58,0.10)]",
            "transition-all duration-200",
            error &&
              "border-red-400 bg-red-50/30 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.10)]",
            className,
          )}
          {...props}
        />
      </div>
      {hint && !error && (
        <p className="text-[12px] text-warm-charcoal/60 font-sans leading-relaxed">{hint}</p>
      )}
      {error && <p className="text-[13px] text-red-500 font-sans">{error}</p>}
    </div>
  );
}
