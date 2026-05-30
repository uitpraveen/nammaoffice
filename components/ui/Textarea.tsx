import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  required,
  ...props
}: TextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={textareaId}
        className="text-[13px] font-semibold font-sans text-warm-charcoal tracking-[-0.005em]"
      >
        {label}
        {required && <span className="text-[var(--color-gold-deep)] ml-0.5">*</span>}
      </label>
      <textarea
        id={textareaId}
        required={required}
        aria-invalid={error ? true : undefined}
        className={cn(
          "rounded-brand border border-warm-border bg-[#fbfaf6] px-4 py-3.5 text-[15px] font-sans text-warm-charcoal leading-relaxed",
          "placeholder:text-warm-charcoal/40",
          "hover:bg-white hover:border-warm-charcoal/25",
          "focus:outline-none focus:bg-white focus:border-warm-charcoal/35 focus:shadow-[0_0_0_4px_rgba(184,85,58,0.10)]",
          "transition-all duration-200",
          "min-h-[120px] resize-y",
          error &&
            "border-red-400 bg-red-50/30 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.10)]",
          className,
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-[12px] text-warm-charcoal/60 font-sans leading-relaxed">{hint}</p>
      )}
      {error && <p className="text-[13px] text-red-500 font-sans">{error}</p>}
    </div>
  );
}
