"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import { FileUpload } from "@/components/ui/FileUpload";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { CheckCircle2 } from "lucide-react";

const TSHIRT_SIZES = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

interface FormState {
  name: string;
  dob: string;
  phone: string;
  companyName: string;
  bikeNumber: string;
  carNumber: string;
  tshirtSize: string;
  email: string;
  gender: string;
  address: string;
  facilities: string;
  comments: string;
  agreeTerms: boolean;
}

const INITIAL: FormState = {
  name: "",
  dob: "",
  phone: "",
  companyName: "",
  bikeNumber: "",
  carNumber: "",
  tshirtSize: "",
  email: "",
  gender: "",
  address: "",
  facilities: "",
  comments: "",
  agreeTerms: false,
};

export function UserRegistrationForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [aadhaar, setAadhaar] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.dob) errs.dob = "Date of birth is required";
    if (!form.agreeTerms) errs.agreeTerms = "Please accept the terms & conditions";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email";
    }
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

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (aadhaar) fd.append("aadhaar", aadhaar);

    try {
      const res = await fetch("/api/registration/user", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white border border-[var(--color-gold-300)] p-8 text-center flex flex-col items-center gap-3">
        <CheckCircle2 className="w-12 h-12 text-[var(--color-gold-deep)]" strokeWidth={1.5} />
        <h2 className="font-display text-2xl text-[var(--color-navy)]">You&apos;re registered</h2>
        <p className="text-[14.5px] text-[var(--color-ink-secondary)] max-w-md">
          Thanks, {form.name || "member"}. Our team will be in touch shortly to confirm your details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Name"
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <DateTimePicker
          label="D.O.B"
          mode="date"
          required
          max={new Date()}
          value={form.dob}
          onChange={(v) => update("dob", v)}
          error={errors.dob}
          placeholder="Select your date of birth"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+91 9000000000"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
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

      <Input
        label="Company Name"
        type="text"
        placeholder="Your company"
        value={form.companyName}
        onChange={(e) => update("companyName", e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Bike Number"
          type="text"
          placeholder="TN 30 AB 1234"
          value={form.bikeNumber}
          onChange={(e) => update("bikeNumber", e.target.value)}
        />
        <Input
          label="Car Number"
          type="text"
          placeholder="TN 30 AB 1234"
          value={form.carNumber}
          onChange={(e) => update("carNumber", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="T-shirt Size"
          options={TSHIRT_SIZES}
          placeholder="Select size"
          value={form.tshirtSize}
          onChange={(e) => update("tshirtSize", e.target.value)}
        />
        <Radio
          label="Gender"
          name="gender"
          options={GENDER_OPTIONS}
          value={form.gender}
          onChange={(v) => update("gender", v)}
          layout="horizontal"
        />
      </div>

      <Textarea
        label="Address"
        placeholder="Your address"
        value={form.address}
        onChange={(e) => update("address", e.target.value)}
      />

      <FileUpload
        label="Aadhaar Card"
        name="aadhaar"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={15}
        helperText="Upload a scan or photo. Used only for membership KYC. Transmitted over TLS, stored encrypted, and accessed only by the NammaOffice onboarding team. See our privacy policy for retention details."
        value={aadhaar}
        onChange={setAadhaar}
      />
      <p className="text-xs text-[var(--color-ink-secondary)] -mt-3">
        By uploading you accept our{" "}
        <a
          href="/privacy-policy"
          className="underline text-[var(--color-gold-deep)] hover:text-[var(--color-gold)]"
        >
          privacy policy
        </a>
        . We never share your Aadhaar with third parties.
      </p>

      <Textarea
        label="Any additional facilities required"
        placeholder="Locker, parking, dedicated desk…"
        value={form.facilities}
        onChange={(e) => update("facilities", e.target.value)}
      />

      <Textarea
        label="Additional Inquiries or Comments"
        placeholder="Anything else we should know?"
        value={form.comments}
        onChange={(e) => update("comments", e.target.value)}
      />

      <div className="flex flex-col gap-1">
        <Checkbox
          label="I agree to the terms & conditions"
          checked={form.agreeTerms}
          onChange={(e) => update("agreeTerms", e.target.checked)}
        />
        {errors.agreeTerms && (
          <p className="text-sm text-red-500 font-sans">{errors.agreeTerms}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Registering…" : "Register"}
      </Button>

      {status === "error" && (
        <p className="text-sm text-red-500 font-sans text-center">
          Something went wrong. Please try again, or call us at +91 9092109213.
        </p>
      )}
    </form>
  );
}
