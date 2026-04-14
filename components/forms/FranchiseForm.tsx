"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function FranchiseForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    spaceSize: "",
    investmentCapacity: "",
    message: "",
  });

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.spaceSize.trim()) errs.spaceSize = "Available space size is required";
    if (!form.investmentCapacity.trim()) errs.investmentCapacity = "Investment capacity is required";
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
      const res = await fetch("/api/franchise", {
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
        label="Full Name"
        type="text"
        placeholder="Your name"
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
      <Input
        label="City"
        type="text"
        placeholder="e.g., Coimbatore, Madurai..."
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
        error={errors.city}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Available Space Size"
          type="text"
          placeholder="e.g., 3000 sq ft"
          value={form.spaceSize}
          onChange={(e) => setForm({ ...form, spaceSize: e.target.value })}
          error={errors.spaceSize}
        />
        <Input
          label="Investment Capacity"
          type="text"
          placeholder="e.g., ₹50 Lakhs"
          value={form.investmentCapacity}
          onChange={(e) => setForm({ ...form, investmentCapacity: e.target.value })}
          error={errors.investmentCapacity}
        />
      </div>
      <Textarea
        label="Message (optional)"
        placeholder="Tell us more about your plans..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <Button type="submit" variant="primary" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Sending..." : "Submit Franchise Enquiry"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-500 font-sans text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
