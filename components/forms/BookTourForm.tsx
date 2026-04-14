"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cities, locations, getLocationsByCity } from "@/lib/data/locations";
import { workspaces } from "@/lib/data/workspaces";
import type { CitySlug } from "@/lib/types";

const STEPS = ["Location", "Workspace", "Date & Time", "Details"];

const TIME_SLOTS = [
  { value: "morning", label: "Morning", time: "9AM – 12PM" },
  { value: "afternoon", label: "Afternoon", time: "12PM – 4PM" },
  { value: "evening", label: "Evening", time: "4PM – 7PM" },
];

const cityOptions = cities.map((c) => ({ value: c.slug, label: c.name }));

interface FormData {
  city: string;
  locationSlug: string;
  workspaceTypes: string[];
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export function BookTourForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    city: "",
    locationSlug: "",
    workspaceTypes: [],
    date: "",
    timeSlot: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const filteredLocations = formData.city
    ? getLocationsByCity(formData.city as CitySlug)
    : [];

  const today = new Date().toISOString().split("T")[0];

  function validateStep(step: number): Record<string, string> {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!formData.city) errs.city = "Please select a city";
      if (!formData.locationSlug) errs.locationSlug = "Please select a location";
    }
    if (step === 1) {
      if (formData.workspaceTypes.length === 0)
        errs.workspaceTypes = "Please select at least one workspace type";
    }
    if (step === 2) {
      if (!formData.date) errs.date = "Please select a date";
      if (!formData.timeSlot) errs.timeSlot = "Please select a time slot";
    }
    if (step === 3) {
      if (!formData.name.trim()) errs.name = "Name is required";
      if (!formData.email.trim()) errs.email = "Email is required";
      if (!formData.phone.trim()) errs.phone = "Phone is required";
    }
    return errs;
  }

  function handleNext() {
    const errs = validateStep(currentStep);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    setErrors({});
    setCurrentStep((s) => s - 1);
  }

  function toggleWorkspaceType(slug: string) {
    setFormData((prev) => ({
      ...prev,
      workspaceTypes: prev.workspaceTypes.includes(slug)
        ? prev.workspaceTypes.filter((t) => t !== slug)
        : [...prev.workspaceTypes, slug],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateStep(3);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/book-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Server error");
      setSubmitted(true);
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    const selectedLocation = locations.find((l) => l.slug === formData.locationSlug);
    const selectedWorkspaces = workspaces.filter((w) =>
      formData.workspaceTypes.includes(w.slug)
    );
    const selectedTimeSlot = TIME_SLOTS.find((t) => t.value === formData.timeSlot);

    return (
      <div className="rounded-brand bg-green-50 border border-green-200 px-6 py-8 space-y-4">
        <p className="text-green-700 font-sans font-semibold text-lg text-center">
          Tour booked successfully!
        </p>
        <div className="text-sm font-sans text-warm-charcoal space-y-2">
          <p>
            <span className="font-medium">Location:</span>{" "}
            {selectedLocation?.name}
          </p>
          <p>
            <span className="font-medium">Workspace:</span>{" "}
            {selectedWorkspaces.map((w) => w.name).join(", ")}
          </p>
          <p>
            <span className="font-medium">Date:</span> {formData.date}
          </p>
          <p>
            <span className="font-medium">Time:</span>{" "}
            {selectedTimeSlot?.label} ({selectedTimeSlot?.time})
          </p>
          <p>
            <span className="font-medium">Name:</span> {formData.name}
          </p>
        </div>
        <p className="text-center text-sm text-warm-gray font-sans">
          We&apos;ll confirm your tour within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      {/* Step panels */}
      <div className="relative overflow-hidden">
        {/* Step 0: Location */}
        <div
          className={cn(
            "transition-all duration-300",
            currentStep === 0 ? "opacity-100 translate-x-0" : "opacity-0 absolute pointer-events-none translate-x-4"
          )}
        >
          {currentStep === 0 && (
            <div className="space-y-4">
              <Select
                label="Select City"
                options={cityOptions}
                placeholder="Choose a city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value, locationSlug: "" })
                }
                error={errors.city}
              />
              {filteredLocations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium font-sans text-warm-charcoal">
                    Select Location
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredLocations.map((loc) => (
                      <button
                        key={loc.slug}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, locationSlug: loc.slug })
                        }
                        className={cn(
                          "text-left px-4 py-3 rounded-brand border transition-all duration-200 font-sans",
                          formData.locationSlug === loc.slug
                            ? "border-terracotta bg-terracotta/5 text-warm-charcoal"
                            : "border-warm-border bg-white hover:border-terracotta/50 text-warm-charcoal"
                        )}
                      >
                        <p className="font-medium text-sm">{loc.name}</p>
                        <p className="text-xs text-warm-gray mt-0.5">{loc.address}</p>
                      </button>
                    ))}
                  </div>
                  {errors.locationSlug && (
                    <p className="text-sm text-red-500 font-sans">{errors.locationSlug}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 1: Workspace */}
        <div
          className={cn(
            "transition-all duration-300",
            currentStep === 1 ? "opacity-100 translate-x-0" : "opacity-0 absolute pointer-events-none translate-x-4"
          )}
        >
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium font-sans text-warm-charcoal">
                Select Workspace Type(s)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {workspaces.map((ws) => {
                  const selected = formData.workspaceTypes.includes(ws.slug);
                  return (
                    <button
                      key={ws.slug}
                      type="button"
                      onClick={() => toggleWorkspaceType(ws.slug)}
                      className={cn(
                        "flex flex-col items-center gap-2 px-3 py-4 rounded-brand border transition-all duration-200 font-sans text-center",
                        selected
                          ? "border-terracotta bg-terracotta/5 text-warm-charcoal"
                          : "border-warm-border bg-white hover:border-terracotta/50 text-warm-charcoal"
                      )}
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {ws.slug === "private-cabin" && "🚪"}
                        {ws.slug === "open-desk" && "💺"}
                        {ws.slug === "cubicle" && "🗂️"}
                        {ws.slug === "meeting-hall" && "🤝"}
                        {ws.slug === "business-lounge" && "☕"}
                        {ws.slug === "managed-office" && "🏢"}
                      </span>
                      <span className="text-xs font-medium">{ws.name}</span>
                    </button>
                  );
                })}
              </div>
              {errors.workspaceTypes && (
                <p className="text-sm text-red-500 font-sans">{errors.workspaceTypes}</p>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Date & Time */}
        <div
          className={cn(
            "transition-all duration-300",
            currentStep === 2 ? "opacity-100 translate-x-0" : "opacity-0 absolute pointer-events-none translate-x-4"
          )}
        >
          {currentStep === 2 && (
            <div className="space-y-4">
              <Input
                label="Preferred Date"
                type="date"
                min={today}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                error={errors.date}
              />
              <div className="space-y-2">
                <p className="text-sm font-medium font-sans text-warm-charcoal">
                  Preferred Time Slot
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <label
                      key={slot.value}
                      className={cn(
                        "flex flex-col items-center gap-1 px-4 py-3 rounded-brand border cursor-pointer transition-all duration-200 font-sans text-center",
                        formData.timeSlot === slot.value
                          ? "border-terracotta bg-terracotta/5 text-warm-charcoal"
                          : "border-warm-border bg-white hover:border-terracotta/50 text-warm-charcoal"
                      )}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot.value}
                        checked={formData.timeSlot === slot.value}
                        onChange={() => setFormData({ ...formData, timeSlot: slot.value })}
                        className="sr-only"
                      />
                      <span className="font-medium text-sm">{slot.label}</span>
                      <span className="text-xs text-warm-gray">{slot.time}</span>
                    </label>
                  ))}
                </div>
                {errors.timeSlot && (
                  <p className="text-sm text-red-500 font-sans">{errors.timeSlot}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Details */}
        <div
          className={cn(
            "transition-all duration-300",
            currentStep === 3 ? "opacity-100 translate-x-0" : "opacity-0 absolute pointer-events-none translate-x-4"
          )}
        >
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+91 9000000000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
              />
              <Input
                label="Company Name (optional)"
                type="text"
                placeholder="Your company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium font-sans text-warm-charcoal">
                  Message (optional)
                </label>
                <textarea
                  className="rounded-brand border border-warm-border bg-white px-4 py-2.5 text-base font-sans text-warm-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta transition-colors duration-200 min-h-[80px] resize-y"
                  placeholder="Any specific requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              {apiError && (
                <p className="text-sm text-red-500 font-sans">{apiError}</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 justify-between pt-2">
        {currentStep > 0 ? (
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div />
        )}
        {currentStep < STEPS.length - 1 ? (
          <Button type="button" variant="primary" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            disabled={loading}
            onClick={(e) => handleSubmit(e as unknown as FormEvent)}
          >
            {loading ? "Submitting..." : "Book Tour"}
          </Button>
        )}
      </div>
    </div>
  );
}
