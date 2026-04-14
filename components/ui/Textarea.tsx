import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  className?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={textareaId}
        className="text-sm font-medium font-sans text-warm-charcoal"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          "rounded-brand border border-warm-border bg-white px-4 py-2.5 text-base font-sans text-warm-charcoal",
          "placeholder:text-warm-gray/60",
          "focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta",
          "transition-colors duration-200",
          "min-h-[120px] resize-y",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 font-sans">{error}</p>
      )}
    </div>
  );
}
