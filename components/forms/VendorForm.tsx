"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FileUpload } from "@/components/ui/FileUpload";
import { FormSection } from "@/components/ui/FormSection";
import { CheckCircle2 } from "lucide-react";
import { scrollToFirstError } from "@/lib/forms/scrollToFirstError";
import { isValidEmail, isValidPhone } from "@/lib/forms/validators";

const CATEGORIES = [
  { value: "Interior & Fit-out", label: "Interior & Fit-out" },
  { value: "Electrical", label: "Electrical" },
  { value: "Air Conditioning (AC / HVAC)", label: "Air Conditioning (AC / HVAC)" },
  { value: "Networking & WiFi Setup", label: "Networking & WiFi Setup" },
  { value: "CCTV & Security Systems", label: "CCTV & Security Systems" },
  { value: "RO Water & Plumbing", label: "RO Water & Plumbing" },
  { value: "Furniture & Fixtures", label: "Furniture & Fixtures" },
  { value: "Cleaning & Housekeeping Services", label: "Cleaning & Housekeeping Services" },
  { value: "Other Services", label: "Other Services" },
];

interface FormState {
  vendorName: string;
  category: string;
  gstNumber: string;
  website: string;
  companyName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  companyPhone: string;
  companyEmail: string;
  ifscCode: string;
  accountNumber: string;
  branchCity: string;
  panName: string;
  panNumber: string;
  bankName: string;
  accountHolderName: string;
  companyAddress: string;
  serviceSpecialization: string;
  comments: string;
  agreeTerms: boolean;
}

const INITIAL: FormState = {
  vendorName: "",
  category: "",
  gstNumber: "",
  website: "",
  companyName: "",
  contactPersonPhone: "",
  contactPersonEmail: "",
  companyPhone: "",
  companyEmail: "",
  ifscCode: "",
  accountNumber: "",
  branchCity: "",
  panName: "",
  panNumber: "",
  bankName: "",
  accountHolderName: "",
  companyAddress: "",
  serviceSpecialization: "",
  comments: "",
  agreeTerms: false,
};

const REQUIRED_FIELDS: (keyof FormState)[] = [
  "vendorName",
  "category",
  "companyName",
  "contactPersonPhone",
  "contactPersonEmail",
  "companyPhone",
  "companyEmail",
  "ifscCode",
  "accountNumber",
  "branchCity",
  "panName",
  "panNumber",
  "bankName",
  "accountHolderName",
  "companyAddress",
  "serviceSpecialization",
];

export function VendorForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [gstDoc, setGstDoc] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [bankPassbook, setBankPassbook] = useState<File | null>(null);
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
    if (!form.agreeTerms) errs.agreeTerms = "Please accept the terms & conditions";
    if (form.contactPersonEmail && !isValidEmail(form.contactPersonEmail)) {
      errs.contactPersonEmail = "Enter a valid email";
    }
    if (form.companyEmail && !isValidEmail(form.companyEmail)) {
      errs.companyEmail = "Enter a valid email";
    }
    if (form.contactPersonPhone && !isValidPhone(form.contactPersonPhone)) {
      errs.contactPersonPhone = "Enter a valid phone number";
    }
    if (form.companyPhone && !isValidPhone(form.companyPhone)) {
      errs.companyPhone = "Enter a valid phone number";
    }
    if (
      form.gstNumber &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/i.test(form.gstNumber.trim())
    ) {
      errs.gstNumber = "Enter a valid 15-character GSTIN";
    }
    if (form.website && !/^https?:\/\/.+\..+/.test(form.website.trim())) {
      errs.website = "Enter a valid URL (https://…)";
    }
    if (form.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(form.panNumber.trim())) {
      errs.panNumber = "PAN format should be ABCDE1234F";
    }
    if (form.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(form.ifscCode.trim())) {
      errs.ifscCode = "IFSC format should be like SBIN0000123";
    }
    if (!bankPassbook) errs.bankPassbook = "Bank passbook upload is required";
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
    if (panCard) fd.append("panCard", panCard);
    if (bankPassbook) fd.append("bankPassbook", bankPassbook);

    try {
      const res = await fetch("/api/registration/vendor", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setServerError(
          data?.error ??
            "Something went wrong. Please try again, or email info@nammaoffice.com."
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
        <h2 className="font-display text-2xl text-[var(--color-navy)]">Application received</h2>
        <p className="text-[14.5px] text-[var(--color-ink-secondary)] max-w-md">
          Thanks, {form.companyName || "partner"}. Our procurement team will review and reach out within 3 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Section: Vendor identity */}
      <FormSection
        title="Vendor identity"
        description="Tell us about your company and service category."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Vendor Name"
            type="text"
            required
            value={form.vendorName}
            onChange={(e) => update("vendorName", e.target.value)}
            error={errors.vendorName}
          />
          <Select
            label="Category of service"
            required
            options={CATEGORIES}
            placeholder="Select category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            error={errors.category}
          />
        </div>
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
            label="Website"
            type="url"
            placeholder="https://example.com"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            error={errors.website}
          />
        </div>
        <Textarea
          label="Company Address"
          required
          value={form.companyAddress}
          onChange={(e) => update("companyAddress", e.target.value)}
          error={errors.companyAddress}
        />
        <Textarea
          label="Service & specialization"
          placeholder="What you offer, key clients, years of experience…"
          required
          value={form.serviceSpecialization}
          onChange={(e) => update("serviceSpecialization", e.target.value)}
          error={errors.serviceSpecialization}
        />
      </FormSection>

      {/* Section: Contact */}
      <FormSection title="Contact details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Person's Phone"
            type="tel"
            required
            value={form.contactPersonPhone}
            onChange={(e) => update("contactPersonPhone", e.target.value)}
            error={errors.contactPersonPhone}
          />
          <Input
            label="Contact Person's Email"
            type="email"
            required
            value={form.contactPersonEmail}
            onChange={(e) => update("contactPersonEmail", e.target.value)}
            error={errors.contactPersonEmail}
          />
          <Input
            label="Company Phone"
            type="tel"
            required
            value={form.companyPhone}
            onChange={(e) => update("companyPhone", e.target.value)}
            error={errors.companyPhone}
          />
          <Input
            label="Company Email"
            type="email"
            required
            value={form.companyEmail}
            onChange={(e) => update("companyEmail", e.target.value)}
            error={errors.companyEmail}
          />
        </div>
      </FormSection>

      {/* Section: GST + PAN */}
      <FormSection title="Tax & identity documents">
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
            label="GST Documents"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company PAN card name"
            type="text"
            required
            value={form.panName}
            onChange={(e) => update("panName", e.target.value)}
            error={errors.panName}
          />
          <Input
            label="PAN number"
            type="text"
            placeholder="ABCDE1234F"
            required
            value={form.panNumber}
            onChange={(e) => update("panNumber", e.target.value.toUpperCase())}
            error={errors.panNumber}
          />
        </div>
        <FileUpload
          label="PAN card"
          name="panCard"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeMB={15}
          value={panCard}
          onChange={(f) => {
            setPanCard(f);
            clearError("panCard");
          }}
          error={errors.panCard}
        />
      </FormSection>

      {/* Section: Banking */}
      <FormSection
        title="Banking details"
        description="Used only for vendor payouts. Encrypted in transit."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Bank name"
            type="text"
            required
            value={form.bankName}
            onChange={(e) => update("bankName", e.target.value)}
            error={errors.bankName}
          />
          <Input
            label="Account holder name"
            type="text"
            required
            value={form.accountHolderName}
            onChange={(e) => update("accountHolderName", e.target.value)}
            error={errors.accountHolderName}
          />
          <Input
            label="Account number"
            type="text"
            required
            value={form.accountNumber}
            onChange={(e) => update("accountNumber", e.target.value)}
            error={errors.accountNumber}
          />
          <Input
            label="IFSC Code"
            type="text"
            placeholder="SBIN0000123"
            required
            value={form.ifscCode}
            onChange={(e) => update("ifscCode", e.target.value.toUpperCase())}
            error={errors.ifscCode}
          />
        </div>
        <Input
          label="Branch & City"
          type="text"
          placeholder="e.g. Salem Main Branch, Salem"
          required
          value={form.branchCity}
          onChange={(e) => update("branchCity", e.target.value)}
          error={errors.branchCity}
        />
        <FileUpload
          label="Bank passbook"
          name="bankPassbook"
          accept=".pdf,.jpg,.jpeg,.png"
          maxSizeMB={15}
          required
          helperText="Used only for vendor payouts. Transmitted over TLS, stored encrypted, and accessed only by NammaOffice finance. See our privacy policy for retention details."
          value={bankPassbook}
          onChange={(f) => {
            setBankPassbook(f);
            clearError("bankPassbook");
          }}
          error={errors.bankPassbook}
        />
        <p className="text-xs text-[var(--color-ink-secondary)] -mt-2">
          By uploading you accept our{" "}
          <a
            href="/privacy-policy"
            className="underline text-[var(--color-gold-deep)] hover:text-[var(--color-gold)]"
          >
            privacy policy
          </a>
          . Your banking details are never shared with third parties.
        </p>
      </FormSection>

      {/* Section: Other */}
      <FormSection title="Anything else?">
        <Textarea
          label="Additional Inquiries or Comments"
          value={form.comments}
          onChange={(e) => update("comments", e.target.value)}
          error={errors.comments}
        />
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

