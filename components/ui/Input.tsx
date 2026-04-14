import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium font-sans text-warm-charcoal"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "rounded-brand border border-warm-border bg-white px-4 py-2.5 text-base font-sans text-warm-charcoal",
          "placeholder:text-warm-gray/60",
          "focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta",
          "transition-colors duration-200",
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
