"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const VIRTUAL_SERVICES = [
  { value: "business-address", label: "Business Address" },
  { value: "mail-handling", label: "Mail Handling" },
  { value: "gst-registration", label: "GST Registration" },
  { value: "roc-registration", label: "ROC Registration" },
];

export function VirtualOfficeForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    businessName: "",
    name: "",
    phone: "",
    email: "",
    services: [] as string[],
    message: "",
  });

  function toggleService(value: string) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter((s) => s !== value)
        : [...prev.services, value],
    }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.businessName.trim()) errs.businessName = "Business name is required";
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (form.services.length === 0) errs.services = "Please select at least one service";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/virtual-office", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-brand bg-green-50 border border-green-200 px-6 py-8 text-center">
        <p className="text-green-700 font-sans font-medium text-lg">
          Thank you! We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Business Name"
        type="text"
        placeholder="Your business or company name"
        value={form.businessName}
        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
        error={errors.businessName}
      />
      <Input
        label="Your Name"
        type="text"
        placeholder="Contact person's name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+91 9000000000"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium font-sans text-warm-charcoal">Services Needed</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VIRTUAL_SERVICES.map((svc) => (
            <Checkbox
              key={svc.value}
              label={svc.label}
              checked={form.services.includes(svc.value)}
              onChange={() => toggleService(svc.value)}
            />
          ))}
        </div>
        {errors.services && (
          <p className="text-sm text-red-500 font-sans">{errors.services}</p>
        )}
      </div>
      <Textarea
        label="Message (optional)"
        placeholder="Any additional requirements..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <Button type="submit" variant="primary" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Sending..." : "Submit Virtual Office Enquiry"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-500 font-sans text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
