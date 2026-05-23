"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { addMinutes, format, isAfter, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

interface DateTimePickerProps {
  label: string;
  /** ISO local-time string `YYYY-MM-DDTHH:mm`, or empty string if unset. */
  value: string;
  onChange: (val: string) => void;
  /** "datetime" (default) shows calendar + time slot list; "date" shows calendar only and stores `YYYY-MM-DD`. */
  mode?: "datetime" | "date";
  required?: boolean;
  error?: string;
  hint?: string;
  /** Earliest moment selectable. For bookings pass `new Date(Date.now() + leadMinutes * 60_000)`. */
  min?: Date;
  /** Latest moment selectable. For DOB pass `new Date()`. */
  max?: Date;
  /** First time-slot hour on future days. Defaults to 8 (8 AM). */
  dayStartHour?: number;
  /** Last time-slot hour, exclusive. Defaults to 21 (so latest slot is 8:45 PM). */
  dayEndHour?: number;
  /** Slot granularity in minutes. Defaults to 15. */
  timeStep?: number;
  /**
   * "label" (default) renders the month/year as plain text with chevron
   * nav. "dropdown" turns them into clickable selects — use this for
   * DOB-style pickers where users need to jump back many years.
   */
  captionLayout?: "label" | "dropdown";
  /** Earliest month the dropdown lets users navigate to. Defaults to ~100 years before max. */
  startMonth?: Date;
  /** Latest month the dropdown lets users navigate to. Defaults to today. */
  endMonth?: Date;
  /** Which month the calendar opens to when no value is set. */
  defaultMonth?: Date;
  placeholder?: string;
  id?: string;
}

/**
 * Premium date / date-time picker — Cal.com style.
 *
 *   ┌──────────────┬────────┐
 *   │   Calendar   │  Time  │
 *   │              │  list  │
 *   └──────────────┴────────┘
 *   │ Soonest         Done  │
 *   └──────────────────────┘
 *
 * Clicking a day highlights it and updates the time-slot column. The
 * value is only committed once a slot is clicked, so the form field
 * never reads "midnight" mid-flow. `min` is enforced both on the
 * calendar (past days disabled) and on the slot list (past slots
 * filtered) so users can't pick a moment in the past.
 */
export function DateTimePicker({
  label,
  value,
  onChange,
  mode = "datetime",
  required,
  error,
  hint,
  min,
  max,
  dayStartHour = 8,
  dayEndHour = 21,
  timeStep = 15,
  captionLayout = "label",
  startMonth,
  endMonth,
  defaultMonth,
  placeholder,
  id,
}: DateTimePickerProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeListRef = useRef<HTMLDivElement>(null);

  const parsed = value ? parseLocal(value) : null;

  // viewingDate = the day whose time slots are shown in the right column.
  // It starts at parsed's date, falls back to defaultMonth, min, then today.
  const [viewingDate, setViewingDate] = useState<Date>(() =>
    stripTime(parsed ?? defaultMonth ?? min ?? new Date()),
  );

  // Re-sync viewingDate when the controlled value changes externally
  // (e.g. parent re-mounts the form with a saved draft).
  useEffect(() => {
    if (parsed) setViewingDate(stripTime(parsed));
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click + ESC
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Scroll the selected slot into view when the picker opens
  useEffect(() => {
    if (!open || !timeListRef.current) return;
    const sel = timeListRef.current.querySelector('[data-selected="true"]') as
      | HTMLElement
      | null;
    if (sel) {
      sel.scrollIntoView({ block: "center" });
    } else {
      timeListRef.current.scrollTop = 0;
    }
  }, [open, value, viewingDate]);

  const display = parsed
    ? mode === "date"
      ? format(parsed, "EEE, d MMM yyyy")
      : format(parsed, "EEE, d MMM yyyy · h:mm a")
    : "";

  const disabledDays = [
    ...(min ? [{ before: stripTime(min) }] : []),
    ...(max ? [{ after: stripTime(max) }] : []),
  ];

  // Build the time slot list for the currently-viewed date.
  const slots = useMemo(() => {
    if (mode !== "datetime") return [];
    const dayStart = new Date(viewingDate);
    dayStart.setHours(dayStartHour, 0, 0, 0);
    const dayEnd = new Date(viewingDate);
    dayEnd.setHours(dayEndHour, 0, 0, 0);
    const out: Date[] = [];
    let t = new Date(dayStart);
    while (t < dayEnd) {
      const okMin = !min || !isBefore(t, min);
      const okMax = !max || !isAfter(t, max);
      if (okMin && okMax) out.push(new Date(t));
      t = addMinutes(t, timeStep);
    }
    return out;
  }, [viewingDate, min, max, mode, dayStartHour, dayEndHour, timeStep]);

  const onCalendarSelect = (d: Date | undefined) => {
    if (!d) return;
    if (mode === "date") {
      onChange(serializeLocal(stripTime(d), "date"));
      setOpen(false);
      return;
    }
    setViewingDate(stripTime(d));
  };

  const onSlotSelect = (slot: Date) => {
    onChange(serializeLocal(slot, "datetime"));
  };

  // Jump to the soonest valid moment (the "Soonest" / "Today" footer button).
  const jumpToSoonest = () => {
    const now = new Date();
    const base = min && now < min ? new Date(min) : now;
    if (mode === "date") {
      onChange(serializeLocal(stripTime(base), "date"));
      setOpen(false);
      return;
    }
    // Round up to next timeStep boundary
    const rounded = new Date(base);
    const rem = rounded.getMinutes() % timeStep;
    if (rem !== 0) {
      rounded.setMinutes(rounded.getMinutes() + (timeStep - rem), 0, 0);
    } else {
      rounded.setSeconds(0, 0);
    }
    // If it spills outside business hours, push to dayStart next day
    if (rounded.getHours() >= dayEndHour) {
      rounded.setDate(rounded.getDate() + 1);
      rounded.setHours(dayStartHour, 0, 0, 0);
    } else if (rounded.getHours() < dayStartHour) {
      rounded.setHours(dayStartHour, 0, 0, 0);
    }
    setViewingDate(stripTime(rounded));
    onChange(serializeLocal(rounded, "datetime"));
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className="text-[13px] font-semibold font-sans text-warm-charcoal tracking-[-0.005em]"
      >
        {label}
        {required && <span className="text-[var(--color-gold-deep)] ml-0.5">*</span>}
      </label>

      <div ref={wrapperRef} className="relative">
        <button
          id={fieldId}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "w-full flex items-center justify-between gap-3 rounded-brand border bg-[#fbfaf6] px-4 py-3.5 text-left text-[15px] font-sans transition-all duration-200",
            "hover:bg-white hover:border-warm-charcoal/25",
            open
              ? "bg-white border-warm-charcoal/35 shadow-[0_0_0_4px_rgba(184,85,58,0.10)]"
              : "border-warm-border",
            display ? "text-warm-charcoal" : "text-warm-charcoal/45",
            error && "border-red-400 bg-red-50/30",
          )}
        >
          <span className="inline-flex items-center gap-2.5 truncate">
            <CalendarIcon
              className="w-[18px] h-[18px] text-[var(--color-gold)] shrink-0"
              strokeWidth={1.75}
            />
            <span className="truncate">
              {display ||
                placeholder ||
                (mode === "date" ? "Select a date" : "Select date & time")}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-warm-charcoal/40 shrink-0 transition-transform duration-200",
              open && "rotate-180 text-warm-charcoal/70",
            )}
            strokeWidth={2}
          />
        </button>

        {open && (
          <>
            {/* Mobile backdrop — taps dismiss the picker */}
            <div
              className="fixed inset-0 z-40 bg-black/35 sm:hidden"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div
              role="dialog"
              aria-label={label}
              className={cn(
                "z-50 rounded-2xl bg-white border border-warm-border overflow-hidden",
                "shadow-[0_24px_64px_-20px_rgba(14,14,14,0.30),_0_8px_24px_-12px_rgba(14,14,14,0.14)]",
                "animate-[fadeInDown_0.18s_ease-out]",
                // Mobile: fixed-position bottom sheet so wide popover always fits viewport
                "fixed inset-x-3 bottom-3 origin-bottom",
                // Desktop+: absolute popover anchored to the field
                "sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-2 sm:origin-top",
                mode === "datetime"
                  ? "sm:w-[480px]"
                  : "sm:w-[328px]",
              )}
            >
            <div className="flex flex-col sm:flex-row">
              {/* Calendar pane */}
              <div className="p-4 sm:flex-1 sm:border-r border-b sm:border-b-0 border-warm-border">
                <DayPicker
                  mode="single"
                  selected={
                    mode === "datetime" ? viewingDate : parsed ?? undefined
                  }
                  onSelect={onCalendarSelect}
                  month={viewingDate}
                  onMonthChange={(m) => setViewingDate(m)}
                  disabled={disabledDays.length ? disabledDays : undefined}
                  showOutsideDays={captionLayout !== "dropdown"}
                  weekStartsOn={1}
                  captionLayout={captionLayout}
                  startMonth={startMonth}
                  endMonth={endMonth}
                  classNames={
                    captionLayout === "dropdown"
                      ? DAY_PICKER_CLASSES_DROPDOWN
                      : DAY_PICKER_CLASSES
                  }
                  components={{
                    Chevron: ({ orientation }) =>
                      orientation === "left" ? (
                        <ChevronLeft className="w-4 h-4" strokeWidth={2.25} />
                      ) : (
                        <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
                      ),
                  }}
                />
              </div>

              {/* Time slot pane */}
              {mode === "datetime" && (
                <div className="w-full sm:w-[136px] flex flex-col">
                  <div className="px-3 pt-3 pb-2 flex items-center gap-1.5 border-b border-warm-border/60">
                    <Clock
                      className="w-3.5 h-3.5 text-warm-charcoal/55"
                      strokeWidth={1.75}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-warm-charcoal/60">
                      {format(viewingDate, "EEE, MMM d")}
                    </span>
                  </div>
                  <div
                    ref={timeListRef}
                    data-lenis-prevent
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    className="overflow-y-auto overscroll-contain px-2 py-2 max-h-[220px] sm:max-h-[300px]"
                  >
                    {slots.length === 0 ? (
                      <div className="px-2 py-6 text-center text-[12px] text-warm-charcoal/55 leading-relaxed">
                        No times available on this day.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {slots.map((slot) => {
                          const isSelected =
                            parsed && parsed.getTime() === slot.getTime();
                          return (
                            <button
                              key={slot.toISOString()}
                              type="button"
                              data-selected={isSelected ? "true" : undefined}
                              onClick={() => onSlotSelect(slot)}
                              className={cn(
                                "w-full text-[13px] font-medium px-3 py-2 rounded-md transition-all duration-150 text-center font-sans",
                                isSelected
                                  ? "bg-[var(--color-gold)] text-white shadow-[0_2px_8px_-2px_rgba(184,85,58,0.50)]"
                                  : "text-warm-charcoal/85 hover:bg-[var(--color-gold-50)] hover:text-[var(--color-gold-deep)]",
                              )}
                            >
                              {format(slot, "h:mm a")}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-warm-border bg-[#fbfaf6]">
              <button
                type="button"
                onClick={jumpToSoonest}
                className="text-[12.5px] font-semibold text-[var(--color-gold-deep)] hover:text-[var(--color-gold)] transition-colors"
              >
                {mode === "date" ? "Today" : "Soonest"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[12.5px] font-semibold px-4 py-1.5 rounded-md bg-warm-charcoal text-white hover:bg-warm-charcoal/85 transition-colors"
              >
                Done
              </button>
            </div>
            </div>
          </>
        )}
      </div>

      {hint && !error && (
        <p className="text-[12px] text-warm-charcoal/60 font-sans leading-relaxed">
          {hint}
        </p>
      )}
      {error && <p className="text-[13px] text-red-500 font-sans">{error}</p>}
    </div>
  );
}

/* ---------- helpers ---------- */

function parseLocal(value: string): Date | null {
  if (!value) return null;
  const [d, t = "00:00"] = value.split("T");
  const [y, mo, da] = d.split("-").map((n) => parseInt(n, 10));
  const [h, mi] = t.split(":").map((n) => parseInt(n, 10));
  if (!y || !mo || !da) return null;
  return new Date(y, mo - 1, da, h || 0, mi || 0);
}

function serializeLocal(date: Date, mode: "date" | "datetime"): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const ymd = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (mode === "date") return ymd;
  return `${ymd}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function stripTime(d: Date): Date {
  return startOfDay(d);
}

/* ---------- react-day-picker classNames ---------- */

const DAY_PICKER_CLASSES = {
  root: "rdp-root w-full",
  months: "flex flex-col gap-2",
  month: "space-y-3",
  month_caption: "relative flex items-center justify-center h-9 mb-1",
  caption_label: "text-[14px] font-semibold text-warm-charcoal tracking-tight",
  /* Year + month dropdown caption (captionLayout="dropdown") */
  dropdowns: "flex items-center justify-center gap-2 px-9",
  dropdown_root: "relative inline-flex items-center",
  dropdown:
    "appearance-none bg-[#fbfaf6] hover:bg-white border border-warm-border rounded-md py-1.5 pl-3 pr-7 text-[13px] font-semibold text-warm-charcoal cursor-pointer focus:outline-none focus:border-warm-charcoal/35 focus:shadow-[0_0_0_3px_rgba(184,85,58,0.10)] transition-colors bg-no-repeat bg-[length:12px_12px] bg-[position:right_8px_center] bg-[image:url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235C5852%22%20stroke-width%3D%222.25%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]",
  months_dropdown: "",
  years_dropdown: "",
  nav: "absolute inset-x-0 top-0 flex items-center justify-between h-9 pointer-events-none",
  button_previous:
    "pointer-events-auto inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--color-gold-50)] text-warm-charcoal/60 hover:text-[var(--color-gold-deep)] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-warm-charcoal/60 disabled:cursor-not-allowed",
  button_next:
    "pointer-events-auto inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--color-gold-50)] text-warm-charcoal/60 hover:text-[var(--color-gold-deep)] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-warm-charcoal/60 disabled:cursor-not-allowed",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday:
    "w-9 text-[10.5px] font-semibold text-warm-charcoal/40 uppercase tracking-[0.08em] pb-1",
  week: "flex w-full mt-0.5",
  day: "w-9 h-9 text-[13px] font-medium text-warm-charcoal text-center align-middle relative p-0",
  day_button:
    "w-9 h-9 rounded-lg inline-flex items-center justify-center hover:bg-[var(--color-gold-50)] hover:text-[var(--color-gold-deep)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-1",
  selected:
    "[&_button]:!bg-[var(--color-gold)] [&_button]:!text-white [&_button]:!font-semibold [&_button]:shadow-[0_2px_8px_-2px_rgba(184,85,58,0.55)] [&_button]:hover:!bg-[var(--color-gold-deep)]",
  today:
    "[&_button]:font-semibold [&_button]:text-[var(--color-gold-deep)] [&_button]:ring-1 [&_button]:ring-[var(--color-gold-200)] [&_button]:ring-inset",
  outside: "[&_button]:text-warm-charcoal/25",
  disabled:
    "[&_button]:!text-warm-charcoal/20 [&_button]:cursor-not-allowed [&_button]:hover:!bg-transparent [&_button]:hover:!text-warm-charcoal/20",
  hidden: "invisible",
};

/* Dropdown caption variant — hides the static caption_label since the
   <select> dropdowns provide the visible month/year, and hides the
   chevron nav since the dropdowns make it redundant. */
const DAY_PICKER_CLASSES_DROPDOWN = {
  ...DAY_PICKER_CLASSES,
  caption_label: "sr-only",
  nav: "hidden",
  month_caption: "relative flex items-center justify-center h-9 mb-2",
};
