"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileUpload } from "@/components/ui/FileUpload";
import { FormSection } from "@/components/ui/FormSection";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { CheckCircle2 } from "lucide-react";
import { scrollToFirstError } from "@/lib/forms/scrollToFirstError";
import { isValidEmail, isValidPhone } from "@/lib/forms/validators";

// Matches the "Which areas of the co-working space are you interested in?"
// dropdown on the Zoho CompanyRegistrationForm1.
const AREA_OPTIONS = [
  { value: "Managed Office", label: "Managed Office" },
  { value: "Private Cabin", label: "Private Cabin" },
  { value: "Cubical", label: "Cubical" },
  { value: "Open Desk", label: "Open Desk" },
];

interface FormState {
  companyName: string;
  natureOfBusiness: string;
  gstNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  contactName: string;
  contactNumber: string;
  email: string;
  website: string;
  companyEmail: string;
  companyPhone: string;
  teamSize: string;
  seatsRequired: string;
  areaInterest: string;
  startDate: string;
  endDate: string;
  founderLinkedin: string;
  companyLinkedin: string;
  agreeTerms: boolean;
}

const INITIAL: FormState = {
  companyName: "",
  natureOfBusiness: "",
  gstNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  postalCode: "",
  country: "India",
  contactName: "",
  contactNumber: "",
  email: "",
  website: "",
  companyEmail: "",
  companyPhone: "",
  teamSize: "",
  seatsRequired: "",
  areaInterest: "",
  startDate: "",
  endDate: "",
  founderLinkedin: "",
  companyLinkedin: "",
  agreeTerms: false,
};

// Text fields the Zoho form marks mandatory (address sub-fields beyond line 1
// are optional in Zoho; files + dates + terms are validated separately).
const REQUIRED_FIELDS: (keyof FormState)[] = [
  "companyName",
  "natureOfBusiness",
  "addressLine1",
  "contactName",
  "contactNumber",
  "email",
  "website",
  "companyEmail",
  "companyPhone",
  "teamSize",
  "seatsRequired",
  "areaInterest",
];

export function CompanyRegistrationForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [gstDoc, setGstDoc] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [businessCard, setBusinessCard] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function clearError(key: string) {
    setErrors((e) => {
      if (!e[key]) return e;
      const n = { ...e };
      delete n[key];
      return n;
    });
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    clearError(key as string);
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    REQUIRED_FIELDS.forEach((f) => {
      const v = form[f];
      if (typeof v === "string" && !v.trim()) errs[f] = "Required";
    });
    if (form.email && !isValidEmail(form.email)) errs.email = "Enter a valid email";
    if (form.companyEmail && !isValidEmail(form.companyEmail)) {
      errs.companyEmail = "Enter a valid email";
    }
    if (form.contactNumber && !isValidPhone(form.contactNumber)) {
      errs.contactNumber = "Enter a valid phone number";
    }
    if (form.companyPhone && !isValidPhone(form.companyPhone)) {
      errs.companyPhone = "Enter a valid phone number";
    }
    // Zoho stores Website as plain text, so accept bare domains too
    // (e.g. "www.nammaoffice.com" or "nammaoffice.com"), scheme optional.
    if (form.website && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/.test(form.website.trim())) {
      errs.website = "Enter a valid website (e.g. nammaoffice.com)";
    }
    if (!form.startDate) errs.startDate = "Required";
    if (!form.endDate) errs.endDate = "Required";
    if (!companyLogo) errs.companyLogo = "Company logo is required";
    if (!businessCard) errs.businessCard = "Business card / ID photo is required";
    if (!form.agreeTerms) errs.agreeTerms = "Please accept the terms & conditions";
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

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (gstDoc) fd.append("gstDoc", gstDoc);
    if (companyLogo) fd.append("companyLogo", companyLogo);
    if (businessCard) fd.append("businessCard", businessCard);

    try {
      const res = await fetch("/api/company-registration", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setServerError(
          data?.error ??
            "Something went wrong. Please try again, or email info@nammaoffice.com.",
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
        <h2 className="font-display text-2xl text-[var(--color-navy)]">Registration received</h2>
        <p className="text-[14.5px] text-[var(--color-ink-secondary)] max-w-md">
          Thanks, {form.companyName || "team"}. Our onboarding team will review your details and reach out within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Section: Company onboarding details */}
      <FormSection
        title="Company onboarding details"
        description="Tell us about your company and primary contact."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            type="text"
            required
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            error={errors.companyName}
          />
          <Input
            label="Nature of Business"
            type="text"
            required
            value={form.natureOfBusiness}
            onChange={(e) => update("natureOfBusiness", e.target.value)}
            error={errors.natureOfBusiness}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GST Number"
            type="text"
            placeholder="If applicable"
            value={form.gstNumber}
            onChange={(e) => update("gstNumber", e.target.value)}
            error={errors.gstNumber}
          />
          <FileUpload
            label="GST Document"
            name="gstDoc"
            accept=".pdf,.jpg,.jpeg,.png"
            maxSizeMB={15}
            value={gstDoc}
            onChange={(f) => {
              setGstDoc(f);
              clearError("gstDoc");
            }}
            error={errors.gstDoc}
          />
        </div>

        <Input
          label="Company Address"
          type="text"
          placeholder="Address line 1"
          required
          value={form.addressLine1}
          onChange={(e) => update("addressLine1", e.target.value)}
          error={errors.addressLine1}
        />
        <Input
          label="Address line 2"
          type="text"
          placeholder="Area, landmark (optional)"
          value={form.addressLine2}
          onChange={(e) => update("addressLine2", e.target.value)}
          error={errors.addressLine2}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="City"
            type="text"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            error={errors.city}
          />
          <Input
            label="State"
            type="text"
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            error={errors.region}
          />
          <Input
            label="Postal Code"
            type="text"
            value={form.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            error={errors.postalCode}
          />
          <Input
            label="Country"
            type="text"
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            error={errors.country}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Person's Name"
            type="text"
            required
            value={form.contactName}
            onChange={(e) => update("contactName", e.target.value)}
            error={errors.contactName}
          />
          <Input
            label="Contact Person's Number"
            type="tel"
            required
            value={form.contactNumber}
            onChange={(e) => update("contactNumber", e.target.value)}
            error={errors.contactNumber}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            error={errors.email}
          />
          <Input
            label="Website"
            type="url"
            placeholder="https://example.com"
            required
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            error={errors.website}
          />
          <Input
            label="Company Email"
            type="email"
            required
            value={form.companyEmail}
            onChange={(e) => update("companyEmail", e.target.value)}
            error={errors.companyEmail}
          />
          <Input
            label="Company Phone"
            type="tel"
            required
            value={form.companyPhone}
            onChange={(e) => update("companyPhone", e.target.value)}
            error={errors.companyPhone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUpload
            label="Company Logo"
            name="companyLogo"
            accept=".jpg,.jpeg,.png,.svg,.webp"
            maxSizeMB={15}
            required
            value={companyLogo}
            onChange={(f) => {
              setCompanyLogo(f);
              clearError("companyLogo");
            }}
            error={errors.companyLogo}
          />
          <FileUpload
            label="Business Card Photo / Employee ID Card"
            name="businessCard"
            accept=".jpg,.jpeg,.png,.pdf,.webp"
            maxSizeMB={15}
            required
            value={businessCard}
            onChange={(f) => {
              setBusinessCard(f);
              clearError("businessCard");
            }}
            error={errors.businessCard}
          />
        </div>
      </FormSection>

      {/* Section: Team size & seating */}
      <FormSection
        title="Team size & seating requirements"
        description="Helps us recommend the right space and plan."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Current Team Size"
            type="text"
            required
            value={form.teamSize}
            onChange={(e) => update("teamSize", e.target.value)}
            error={errors.teamSize}
          />
          <Input
            label="No. of Seats Required"
            type="text"
            required
            value={form.seatsRequired}
            onChange={(e) => update("seatsRequired", e.target.value)}
            error={errors.seatsRequired}
          />
          <Select
            label="Areas you're interested in"
            required
            options={AREA_OPTIONS}
            placeholder="Select an option"
            value={form.areaInterest}
            onChange={(e) => update("areaInterest", e.target.value)}
            error={errors.areaInterest}
          />
        </div>
      </FormSection>

      {/* Section: Onboard duration */}
      <FormSection
        title="Company onboard duration"
        description="When would you like the engagement to run?"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateTimePicker
            label="Start Date"
            mode="date"
            required
            value={form.startDate}
            onChange={(v) => update("startDate", v)}
            error={errors.startDate}
          />
          <DateTimePicker
            label="End Date"
            mode="date"
            required
            value={form.endDate}
            onChange={(v) => update("endDate", v)}
            error={errors.endDate}
          />
        </div>
      </FormSection>

      {/* Section: Social links */}
      <FormSection title="Social links" description="Optional.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Founder LinkedIn Profile"
            type="url"
            placeholder="https://linkedin.com/in/…"
            value={form.founderLinkedin}
            onChange={(e) => update("founderLinkedin", e.target.value)}
            error={errors.founderLinkedin}
          />
          <Input
            label="Company LinkedIn Profile"
            type="url"
            placeholder="https://linkedin.com/company/…"
            value={form.companyLinkedin}
            onChange={(e) => update("companyLinkedin", e.target.value)}
            error={errors.companyLinkedin}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Checkbox
            label="I agree to the terms & conditions"
            checked={form.agreeTerms}
            onChange={(e) => update("agreeTerms", e.target.checked)}
            error={errors.agreeTerms}
          />
        </div>
      </FormSection>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Submitting…" : "Register"}
      </Button>

      {status === "error" && (
        <p className="text-sm text-red-500 font-sans text-center">
          {serverError ??
            "Something went wrong. Please try again, or email info@nammaoffice.com."}
        </p>
      )}
    </form>
  );
}
