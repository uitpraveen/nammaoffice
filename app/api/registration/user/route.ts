import { NextResponse } from "next/server";
import { format, parseISO } from "date-fns";
import {
  submitToZohoFormJson,
  uploadZohoFile,
  type ZohoJsonValue,
} from "@/lib/zoho";

export const runtime = "nodejs";
export const maxDuration = 60;

// Our form's gender slugs -> the exact Zoho "Gender" dropdown option labels.
const GENDER_TO_ZOHO: Record<string, string> = {
  male: "Male",
  female: "Female",
  "prefer-not-to-say": "Prefer not to say",
};

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const data = Object.fromEntries(
      Array.from(fd.entries()).filter(([, v]) => typeof v === "string"),
    ) as Record<string, string>;

    if (!data.dob) {
      return NextResponse.json({ error: "Date of birth is required" }, { status: 400 });
    }
    if (data.agreeTerms !== "true") {
      return NextResponse.json({ error: "Terms must be accepted" }, { status: 400 });
    }

    const formUrl = process.env.ZOHO_FORM_URL_USER;
    if (!formUrl) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // Zoho "Date" field is configured as dd-MMM-yyyy; our picker emits yyyy-MM-dd.
    let dob = data.dob;
    try {
      dob = format(parseISO(data.dob), "dd-MMM-yyyy");
    } catch {
      /* leave as-is — Zoho will reject only if truly malformed */
    }

    // Aadhaar: two-step upload (stream to publicupload, then reference by path),
    // same flow as the vendor form. Field link name is "FileUpload".
    const aadhaarFile = fd.get("aadhaar");
    let aadhaarPath: string | null = null;
    if (aadhaarFile instanceof File && aadhaarFile.size > 0) {
      aadhaarPath = await uploadZohoFile(aadhaarFile, {
        formUrl,
        fieldLinkName: "FileUpload",
      });
    }

    // Confirmed Zoho link-name mapping for the User Registration form.
    // NOTE: "Name" (composite First/Last) and "Address" (composite) are
    // intentionally omitted — the JSON /records API rejects composite fields,
    // so they stay out until those two are flattened to Single Line / Multi
    // Line in the Zoho builder. All fields here are optional in Zoho.
    const fields: Record<string, ZohoJsonValue> = {
      Email: data.email || undefined,
      Date: dob,
      Dropdown: GENDER_TO_ZOHO[data.gender] || undefined, // Gender
      PhoneNumber: data.phone || undefined,
      SingleLine2: data.companyName || undefined, // Company Name
      SingleLine4: data.bikeNumber || undefined, // Bike Number
      SingleLine3: data.carNumber || undefined, // Car Number
      Dropdown1: data.tshirtSize || undefined, // T-shirt Size
      SingleLine: data.facilities || undefined, // Any additional facilities
      SingleLine1: data.comments || undefined, // Additional Inquiries / Comments
    };
    if (aadhaarPath) {
      fields["FileUpload-v2"] = [aadhaarPath];
    }

    const ok = await submitToZohoFormJson(formUrl, fields);
    if (!ok) {
      return NextResponse.json(
        { error: "Submission could not be delivered" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("User registration error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
