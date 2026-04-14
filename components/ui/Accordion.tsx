"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "flex-shrink-0 transition-transform duration-200",
        open && "rotate-180"
      )}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-warm-border rounded-brand overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className={cn(
                "w-full flex items-center justify-between gap-4 px-6 py-4",
                "text-left font-sans font-medium text-warm-charcoal",
                "transition-colors duration-200",
                isOpen ? "bg-sand/50" : "bg-white hover:bg-sand/50"
              )}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <ChevronIcon open={isOpen} />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[600px]" : "max-h-0"
              )}
            >
              <div className="px-6 py-4 bg-white text-warm-gray font-sans text-base leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
