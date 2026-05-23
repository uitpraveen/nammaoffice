import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

export function Checkbox({
  label,
  className,
  id,
  checked,
  ...props
}: CheckboxProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      htmlFor={checkboxId}
      className={cn(
        "inline-flex items-start gap-3 cursor-pointer select-none group",
        className,
      )}
    >
      <span className="relative inline-flex items-center justify-center mt-0.5 shrink-0">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          className="peer appearance-none w-[18px] h-[18px] rounded-md border border-warm-border bg-white cursor-pointer transition-colors checked:bg-[var(--color-gold)] checked:border-[var(--color-gold)] hover:border-[var(--color-gold-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-1"
          {...props}
        />
        <Check
          className="pointer-events-none absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
          strokeWidth={3.5}
        />
      </span>
      <span className="text-[14px] font-sans text-warm-charcoal leading-snug">
        {label}
      </span>
    </label>
  );
}
