import { cn } from "@/lib/utils";

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

interface ProcessStepperProps {
  steps: ProcessStep[];
  className?: string;
}

export function ProcessStepper({ steps, className }: ProcessStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start">
        {steps.map((item, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div key={item.step} className="flex items-start flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center font-serif font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                {/* Text below circle */}
                <div className="mt-4 text-center max-w-[160px]">
                  <p className="font-sans font-medium text-warm-charcoal text-sm leading-snug">
                    {item.title}
                  </p>
                  <p className="font-sans text-xs text-warm-gray mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-0.5 bg-terracotta/30 mx-3 mt-6" />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex flex-col gap-0 md:hidden">
        {steps.map((item, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div key={item.step} className="flex gap-4">
              {/* Left: circle + vertical line */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center font-serif font-bold text-base flex-shrink-0">
                  {item.step}
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 bg-terracotta/30 my-2" />
                )}
              </div>
              {/* Right: text */}
              <div className={cn("pb-6", isLast && "pb-0")}>
                <p className="font-sans font-medium text-warm-charcoal text-sm leading-snug mt-2">
                  {item.title}
                </p>
                <p className="font-sans text-xs text-warm-gray mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
