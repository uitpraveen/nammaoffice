"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { FormSection } from "@/components/ui/FormSection";
import {
  SERVICE_REQUEST_AREAS,
  SERVICE_REQUEST_BRANCHES,
  SERVICE_REQUEST_FLOORS,
} from "@/lib/data/zoho-service-request";
import { scrollToFirstError } from "@/lib/forms/scrollToFirstError";
import { isValidEmail, isValidPhone } from "@/lib/forms/validators";

interface FormState {
  companyName: string;
  personName: string;
  phone: string;
  email: string;
  ccEmail1: string;
  ccEmail2: string;
  ticketTitle: string;
  branch: string;
  area: string;
  areaOther: string;
  floor: string;
  floorOther: string;
  description: string;
  attachment: File | null;
  honeypot: string;
}

const initialState: FormState = {
  companyName: "",
  personName: "",
  phone: "",
  email: "",
  ccEmail1: "",
  ccEmail2: "",
  ticketTitle: "",
  branch: "",
  area: "",
  areaOther: "",
  floor: "",
  floorOther: "",
  description: "",
  attachment: null,
  honeypot: "",
};

export function ServiceRequestForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const n = { ...e };
      delete n[key as string];
      return n;
    });
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.companyName.trim()) errs.companyName = "Required";
    if (!form.personName.trim()) errs.personName = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    else if (!isValidPhone(form.phone)) errs.phone = "Enter a valid phone number";
    if (!form.email.trim()) errs.email = "Required";
    else if (!isValidEmail(form.email)) errs.email = "Enter a valid email";
    if (form.ccEmail1 && !isValidEmail(form.ccEmail1)) errs.ccEmail1 = "Enter a valid email";
    if (form.ccEmail2 && !isValidEmail(form.ccEmail2)) errs.ccEmail2 = "Enter a valid email";
    if (!form.ticketTitle.trim()) errs.ticketTitle = "Required";
    if (!form.branch) errs.branch = "Required";
    if (!form.area) errs.area = "Required";
    if (form.area === "Other" && !form.areaOther.trim()) {
      errs.areaOther = "Tell us which area";
    }
    if (form.floor === "Other" && !form.floorOther.trim()) {
      errs.floorOther = "Tell us which floor";
    }
    if (!form.description.trim()) errs.description = "Required";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.honeypot) return; // Bot — silently drop.
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      scrollToFirstError();
      return;
    }
    setErrors({});
    setServerError(null);
    setStatus("loading");

    try {
      const fd = new FormData();
      fd.append("companyName", form.companyName);
      fd.append("personName", form.personName);
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("ccEmail1", form.ccEmail1);
      fd.append("ccEmail2", form.ccEmail2);
      fd.append("ticketTitle", form.ticketTitle);
      fd.append("branch", form.branch);
      fd.append("area", form.area);
      fd.append("areaOther", form.areaOther);
      fd.append("floor", form.floor);
      fd.append("floorOther", form.floorOther);
      fd.append("description", form.description);
      if (form.attachment) fd.append("attachment", form.attachment);

      const res = await fetch("/api/service-request", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setServerError(
          data?.error ?? "Something went wrong. Please try again, or call +91 9092109213."
        );
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
      <div className="rounded-2xl bg-white border border-[var(--color-gold-300)] p-8 text-center flex flex-col items-center gap-3">
        <CheckCircle2 className="w-12 h-12 text-[var(--color-gold-deep)]" strokeWidth={1.5} />
        <h2 className="font-display text-2xl text-[var(--color-navy)]">
          Ticket received
        </h2>
        <p className="text-[14.5px] text-[var(--color-ink-secondary)] max-w-md">
          Your service request has been logged. The centre team will reach out
          on the contact details provided — usually within an hour during
          operating hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Honeypot — hidden from real users, visible to bots */}
      <input
        type="text"
        name="company_url"
        value={form.honeypot}
        onChange={(e) => update("honeypot", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-px h-px"
        aria-hidden="true"
      />

      <FormSection title="Who is reporting?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Requesting Company Name"
            type="text"
            required
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            error={errors.companyName}
          />
          <Input
            label="Requesting Person Name"
            type="text"
            required
            value={form.personName}
            onChange={(e) => update("personName", e.target.value)}
            error={errors.personName}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone"
            type="tel"
            placeholder="+91 9000000000"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            error={errors.phone}
          />
          <Input
            label="Requesting Person Email (Primary)"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Cc Email 1 (If any)"
            type="email"
            value={form.ccEmail1}
            onChange={(e) => update("ccEmail1", e.target.value)}
            error={errors.ccEmail1}
          />
          <Input
            label="Cc Email 2 (If any)"
            type="email"
            value={form.ccEmail2}
            onChange={(e) => update("ccEmail2", e.target.value)}
            error={errors.ccEmail2}
          />
        </div>
      </FormSection>

      <FormSection title="What's the issue?">
        <Input
          label="Ticket Title"
          type="text"
          required
          value={form.ticketTitle}
          onChange={(e) => update("ticketTitle", e.target.value)}
          error={errors.ticketTitle}
          hint="A short summary of the issue — e.g. ‘AC not cooling — Discussion Room 3’."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Branch Name"
            required
            placeholder="Select your branch"
            options={SERVICE_REQUEST_BRANCHES.map((b) => ({ value: b, label: b }))}
            value={form.branch}
            onChange={(e) => update("branch", e.target.value)}
            error={errors.branch}
          />
          <Select
            label="Floor"
            placeholder="Select floor (optional)"
            options={SERVICE_REQUEST_FLOORS.map((f) => ({ value: f, label: f }))}
            value={form.floor}
            onChange={(e) => {
              update("floor", e.target.value);
              if (e.target.value !== "Other") {
                update("floorOther", "");
                setErrors((errs) => {
                  if (!errs.floorOther) return errs;
                  const n = { ...errs };
                  delete n.floorOther;
                  return n;
                });
              }
            }}
            error={errors.floor}
          />
        </div>
        {form.floor === "Other" && (
          <Input
            label="Floor (other)"
            type="text"
            placeholder="Mention the floor"
            required
            value={form.floorOther}
            onChange={(e) => update("floorOther", e.target.value)}
            error={errors.floorOther}
          />
        )}
        <Select
          label="Area"
          required
          placeholder="Select area"
          options={SERVICE_REQUEST_AREAS.map((a) => ({ value: a, label: a }))}
          value={form.area}
          onChange={(e) => {
            update("area", e.target.value);
            if (e.target.value !== "Other") {
              update("areaOther", "");
              setErrors((errs) => {
                if (!errs.areaOther) return errs;
                const n = { ...errs };
                delete n.areaOther;
                return n;
              });
            }
          }}
          error={errors.area}
        />
        {form.area === "Other" && (
          <Input
            label="Area (other)"
            type="text"
            placeholder="Describe the area"
            required
            value={form.areaOther}
            onChange={(e) => update("areaOther", e.target.value)}
            error={errors.areaOther}
          />
        )}
        <Textarea
          label="Issue Description"
          required
          rows={5}
          placeholder="Steps to reproduce, when it started, anything that helps the centre team triage faster."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          error={errors.description}
        />
        <FileUpload
          label="Attachments (Optional)"
          name="attachment"
          accept=".jpg,.jpeg,.png,.pdf"
          maxSizeMB={15}
          value={form.attachment}
          onChange={(file) => update("attachment", file)}
          error={errors.attachment}
          helperText="A photo or PDF makes triage faster. JPG, PNG, or PDF up to 15 MB."
        />
      </FormSection>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Submitting…" : "Raise service request"}
      </Button>

      {status === "error" && (
        <p className="text-sm text-red-500 font-sans text-center">
          {serverError ?? "Something went wrong. Please try again, or call +91 9092109213."}
        </p>
      )}
    </form>
  );
}
