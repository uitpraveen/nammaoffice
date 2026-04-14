import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-sans font-semibold text-sm transition-all duration-300",
                    isCompleted && "bg-terracotta text-white",
                    isCurrent &&
                      "bg-terracotta text-white ring-4 ring-terracotta/20",
                    !isCompleted && !isCurrent && "bg-sand text-warm-gray"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? <CheckIcon /> : <span>{index + 1}</span>}
                </div>
                {/* Step label */}
                <span
                  className={cn(
                    "hidden md:block mt-2 text-xs font-sans text-center max-w-[80px]",
                    (isCompleted || isCurrent)
                      ? "text-warm-charcoal font-medium"
                      : "text-warm-gray"
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mb-5 md:mb-7 transition-colors duration-300",
                    index < currentStep ? "bg-terracotta" : "bg-warm-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
