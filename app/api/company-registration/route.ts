import { NextResponse } from "next/server";
import { format, parseISO } from "date-fns";
import {
  submitToZohoFormJson,
  uploadZohoFile,
  type ZohoJsonValue,
} from "@/lib/zoho";
import { phoneDigits } from "@/lib/forms/validators";

export const runtime = "nodejs";
export const maxDuration = 60;

// Text fields the Zoho CompanyRegistrationForm1 marks mandatory.
const REQUIRED = [
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
  "startDate",
  "endDate",
] as const;

// Zoho "Date" fields are configured as dd-MMM-yyyy; our picker emits yyyy-MM-dd.
function toZohoDate(value: string): string {
  try {
    return format(parseISO(value), "dd-MMM-yyyy");
  } catch {
    return value;
  }
}

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const data = Object.fromEntries(
      Array.from(fd.entries()).filter(([, v]) => typeof v === "string"),
    ) as Record<string, string>;

    for (const key of REQUIRED) {
      if (!data[key]?.trim()) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }
    if (data.agreeTerms !== "true") {
      return NextResponse.json({ error: "Terms must be accepted" }, { status: 400 });
    }

    const logoFile = fd.get("companyLogo");
    const cardFile = fd.get("businessCard");
    const gstFile = fd.get("gstDoc");

    if (!(logoFile instanceof File) || logoFile.size === 0) {
      return NextResponse.json({ error: "Company logo is required" }, { status: 400 });
    }
    if (!(cardFile instanceof File) || cardFile.size === 0) {
      return NextResponse.json(
        { error: "Business card / ID photo is required" },
        { status: 400 },
      );
    }

    const formUrl = process.env.ZOHO_FORM_URL_COMPANY;
    if (!formUrl) {
      console.error("Company registration: ZOHO_FORM_URL_COMPANY is not set");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // Zoho public forms upload files in two steps: stream each file to the
    // staging host (uploadZohoFile → filepath), then reference the path in the
    // /records JSON under "<FieldLinkName>-v2". Company Logo → FileUpload1,
    // Business Card → ImageUpload, GST Document → FileUpload (optional).
    const upload = (file: File, field: string) =>
      uploadZohoFile(file, { formUrl, fieldLinkName: field });

    const logoPath = await upload(logoFile, "FileUpload1");
    if (!logoPath) {
      return NextResponse.json({ error: "Company logo upload failed" }, { status: 502 });
    }
    const cardPath = await upload(cardFile, "ImageUpload");
    if (!cardPath) {
      return NextResponse.json(
        { error: "Business card upload failed" },
        { status: 502 },
      );
    }
    const gstPath =
      gstFile instanceof File && gstFile.size > 0
        ? await upload(gstFile, "FileUpload")
        : null;

    // Field keys are the exact link names from the published Zoho
    // CompanyRegistrationForm1. The Address composite uses "Address_*" sub-keys;
    // files use the "<FieldLinkName>-v2" array convention.
    const fields: Record<string, ZohoJsonValue> = {
      SingleLine: data.companyName, // Company Name
      SingleLine2: data.natureOfBusiness, // Nature of Business
      SingleLine4: data.gstNumber || undefined, // GST Number (optional)
      Address: {
        Address_AddressLine1: data.addressLine1,
        Address_AddressLine2: data.addressLine2 || "",
        Address_City: data.city || "",
        Address_Region: data.region || "",
        Address_ZipCode: data.postalCode || "",
        Address_Country: data.country || "",
      },
      SingleLine1: data.contactName, // Contact Person's Name
      SingleLine3: data.contactNumber, // Contact Person's number
      Email: data.email, // Email
      SingleLine5: data.website, // Website
      Email1: data.companyEmail, // Company Email
      PhoneNumber: phoneDigits(data.companyPhone), // Company Phone (digits only)
      SingleLine6: data.teamSize, // Current Team Size
      SingleLine7: data.seatsRequired, // No of Seats Required
      Dropdown: data.areaInterest, // Areas interested in
      Date: toZohoDate(data.startDate), // Start Date
      Date1: toZohoDate(data.endDate), // End Date
      SingleLine8: data.founderLinkedin || undefined, // Founder LinkedIn (optional)
      SingleLine9: data.companyLinkedin || undefined, // Company LinkedIn (optional)
      TermsConditions: "true",
      "FileUpload1-v2": [logoPath], // Company Logo (required)
      "ImageUpload-v2": [cardPath], // Business Card / ID (required)
      ...(gstPath ? { "FileUpload-v2": [gstPath] } : {}), // GST Document (optional)
    };

    const ok = await submitToZohoFormJson(formUrl, fields);
    if (!ok) {
      return NextResponse.json(
        { error: "Submission could not be delivered" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Company registration API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
