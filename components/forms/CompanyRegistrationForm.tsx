"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { scrollToFirstError } from "@/lib/forms/scrollToFirstError";
import { isValidEmail, isValidPhone } from "@/lib/forms/validators";

const COMPANY_TYPES = [
  { value: "private-limited", label: "Private Limited" },
  { value: "llp", label: "LLP" },
  { value: "partnership", label: "Partnership" },
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "opc", label: "OPC" },
];

export function CompanyRegistrationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [form, setForm] = useState({
    companyName: "",
    companyType: "",
    numberOfDirectors: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const n = { ...e };
      delete n[key as string];
      return n;
    });
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.companyName.trim()) errs.companyName = "Company name is required";
    if (!form.companyType) errs.companyType = "Company type is required";
    if (!form.name.trim()) errs.name = "Contact name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!isValidPhone(form.phone)) errs.phone = "Enter a valid phone number";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!isValidEmail(form.email)) errs.email = "Enter a valid email";
    if (form.numberOfDirectors && Number(form.numberOfDirectors) < 1)
      errs.numberOfDirectors = "Must be at least 1";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      scrollToFirstError();
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/company-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setServerError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
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
        label="Company Name"
        type="text"
        placeholder="Your proposed company name"
        value={form.companyName}
        onChange={(e) => update("companyName", e.target.value)}
        error={errors.companyName}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Company Type"
          options={COMPANY_TYPES}
          placeholder="Select type"
          value={form.companyType}
          onChange={(e) => update("companyType", e.target.value)}
          error={errors.companyType}
        />
        <Input
          label="Number of Directors"
          type="number"
          placeholder="e.g., 2"
          min="1"
          value={form.numberOfDirectors}
          onChange={(e) => update("numberOfDirectors", e.target.value)}
          error={errors.numberOfDirectors}
        />
      </div>
      <Input
        label="Contact Name"
        type="text"
        placeholder="Your name"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+91 9000000000"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
        />
      </div>
      <Textarea
        label="Message (optional)"
        placeholder="Any specific requirements or questions..."
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
      />
      <Button type="submit" variant="primary" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Sending..." : "Submit Registration Enquiry"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-red-500 font-sans text-center">
          {serverError ?? "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}
