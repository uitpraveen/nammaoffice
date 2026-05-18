"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { locations } from "@/lib/data/locations";

// Two centres share the slug "tidel-neo" (Salem & Tirupur), so the
// option value must include the city to stay unique — otherwise the
// rendered <option> elements collide on React's key.
const locationOptions = locations.map((loc) => ({
  value: `${loc.city}/${loc.slug}`,
  label: `${loc.name} — ${loc.city.charAt(0).toUpperCase() + loc.city.slice(1)}`,
}));

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    subject: "",
    message: "",
  });

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
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
      const res = await fetch("/api/contact", {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+91 9000000000"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
        />
        <Select
          label="Location (optional)"
          options={locationOptions}
          placeholder="Select a location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>
      <Input
        label="Subject"
        type="text"
        placeholder="How can we help?"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        error={errors.subject}
      />
      <Textarea
        label="Message"
        placeholder="Write your message..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        error={errors.message}
      />
      <Button type="submit" variant="primary" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-500 font-sans text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
