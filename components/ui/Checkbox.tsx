import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <input
        type="checkbox"
        id={checkboxId}
        className={cn(
          "w-4 h-4 rounded accent-terracotta cursor-pointer",
          "focus:ring-2 focus:ring-terracotta focus:ring-offset-1"
        )}
        {...props}
      />
      <label
        htmlFor={checkboxId}
        className="text-sm font-sans text-warm-charcoal cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
}
