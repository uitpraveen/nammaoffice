import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { workspaces } from "@/lib/data/workspaces";

const FEATURES = [
  { key: "capacity", label: "Capacity" },
  { key: "privacy", label: "Privacy" },
  { key: "flexibility", label: "Flexibility" },
  { key: "bestFor", label: "Best For" },
  { key: "high-speed-wifi", label: "High-Speed Wi-Fi", isAmenity: true },
  { key: "power-backup", label: "Power Backup", isAmenity: true },
  { key: "air-conditioning", label: "Air Conditioning", isAmenity: true },
  { key: "cafeteria", label: "Cafeteria", isAmenity: true },
  { key: "printing", label: "Printing & Scanning", isAmenity: true },
  { key: "parking", label: "Parking", isAmenity: true },
  { key: "security", label: "Security", isAmenity: true },
  { key: "locker", label: "Personal Locker", isAmenity: true },
  { key: "conference-room", label: "Conference Room", isAmenity: true },
  { key: "reception", label: "Reception", isAmenity: true },
  { key: "ergonomic-furniture", label: "Ergonomic Furniture", isAmenity: true },
  { key: "breakout-zone", label: "Breakout Zone", isAmenity: true },
];

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-terracotta mx-auto"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-warm-gray/40 mx-auto"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ComparisonTable({ className }: { className?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="min-w-full border-collapse text-sm font-sans">
        <thead>
          <tr>
            {/* Sticky feature column header */}
            <th className="sticky left-0 z-10 bg-white min-w-[150px] px-4 py-4 text-left font-medium text-warm-charcoal border-b border-warm-border">
              Feature
            </th>
            {workspaces.map((ws) => (
              <th
                key={ws.slug}
                className="min-w-[140px] px-4 py-4 text-center font-semibold text-warm-charcoal border-b border-warm-border bg-sand/50"
              >
                {ws.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((feature, rowIndex) => {
            const isEven = rowIndex % 2 === 0;
            return (
              <tr key={feature.key} className={isEven ? "bg-sand/30" : "bg-white"}>
                {/* Sticky first column */}
                <td
                  className={cn(
                    "sticky left-0 z-10 px-4 py-3 font-medium text-warm-charcoal border-b border-warm-border/50",
                    isEven ? "bg-sand/30" : "bg-white"
                  )}
                >
                  {feature.label}
                </td>
                {workspaces.map((ws) => {
                  const wsRecord = ws as unknown as Record<string, unknown>;
                  const value = feature.isAmenity
                    ? ws.amenities.includes(feature.key)
                    : wsRecord[feature.key];

                  return (
                    <td
                      key={ws.slug}
                      className="px-4 py-3 text-center border-b border-warm-border/50"
                    >
                      {feature.isAmenity ? (
                        value ? <CheckIcon /> : <CrossIcon />
                      ) : (
                        <span className="text-warm-gray text-xs leading-snug">
                          {String(value ?? "—")}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* Footer row with CTA */}
          <tr className="bg-sand/50">
            <td className="sticky left-0 z-10 bg-sand/50 px-4 py-4 font-medium text-warm-charcoal">
              Pricing
            </td>
            {workspaces.map((ws) => (
              <td key={ws.slug} className="px-4 py-4 text-center">
                <Button
                  href="/contact"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Contact Us
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
