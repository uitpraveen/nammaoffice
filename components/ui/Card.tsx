import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  className?: string;
  hover?: boolean;
  children: ReactNode;
}

export function Card({ className, hover = false, children }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-brand shadow-brand overflow-hidden",
        hover &&
          "hover:shadow-brand-hover hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
