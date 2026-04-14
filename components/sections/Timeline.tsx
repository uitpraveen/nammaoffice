import { cn } from "@/lib/utils";

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  milestones: Milestone[];
  className?: string;
}

export function Timeline({ milestones, className }: TimelineProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: horizontal scroll timeline */}
      <div className="hidden md:block overflow-x-auto pb-4">
        <div className="flex items-start min-w-max px-4">
          {milestones.map((milestone, index) => {
            const isLast = index === milestones.length - 1;
            return (
              <div key={milestone.year} className="flex items-start">
                {/* Milestone block */}
                <div className="flex flex-col items-center w-48">
                  {/* Dot on line */}
                  <div className="flex items-center w-full mb-4">
                    {index > 0 && (
                      <div className="flex-1 h-0.5 bg-terracotta/30" />
                    )}
                    <div className="w-4 h-4 rounded-full bg-terracotta border-4 border-terracotta/20 flex-shrink-0" />
                    {!isLast && (
                      <div className="flex-1 h-0.5 bg-terracotta/30" />
                    )}
                  </div>
                  {/* Content */}
                  <div className="text-center px-3">
                    <p className="font-serif text-terracotta text-xl font-bold">
                      {milestone.year}
                    </p>
                    <p className="font-sans font-medium text-warm-charcoal text-sm mt-1 leading-snug">
                      {milestone.title}
                    </p>
                    <p className="font-sans text-xs text-warm-gray mt-1 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex flex-col gap-0 md:hidden">
        {milestones.map((milestone, index) => {
          const isLast = index === milestones.length - 1;
          return (
            <div key={milestone.year} className="flex gap-4">
              {/* Left: dot + vertical line */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-terracotta border-4 border-terracotta/20 flex-shrink-0 mt-1" />
                {!isLast && (
                  <div className="w-0.5 flex-1 bg-terracotta/30 my-2" />
                )}
              </div>
              {/* Right: content */}
              <div className={cn("pb-6", isLast && "pb-0")}>
                <p className="font-serif text-terracotta text-lg font-bold leading-tight">
                  {milestone.year}
                </p>
                <p className="font-sans font-medium text-warm-charcoal text-sm mt-0.5 leading-snug">
                  {milestone.title}
                </p>
                <p className="font-sans text-xs text-warm-gray mt-1 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
