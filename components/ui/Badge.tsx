import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-medium font-sans bg-sand text-warm-gray",
        className
      )}
    >
      {children}
    </span>
  );
}
