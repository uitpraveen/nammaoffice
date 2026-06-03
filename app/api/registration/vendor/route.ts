import { NextResponse } from "next/server";
import { submitToZohoFormJson, uploadZohoFile } from "@/lib/zoho";
import { phoneDigits } from "@/lib/forms/validators";

export const runtime = "nodejs";
export const maxDuration = 60;

const REQUIRED = [
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
] as const;

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const data = Object.fromEntries(
      Array.from(fd.entries()).filter(([, v]) => typeof v === "string")
    ) as Record<string, string>;

    for (const key of REQUIRED) {
      if (!data[key]) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }
    if (data.agreeTerms !== "true") {
      return NextResponse.json({ error: "Terms must be accepted" }, { status: 400 });
    }

    const gstFile = fd.get("gstDoc");
    const panFile = fd.get("panCard");
    const bankFile = fd.get("bankPassbook");

    if (!(bankFile instanceof File) || bankFile.size === 0) {
      return NextResponse.json({ error: "Bank passbook is required" }, { status: 400 });
    }

    const formUrl = process.env.ZOHO_FORM_URL_VENDOR;
    if (!formUrl) {
      console.error("Vendor onboarding: ZOHO_FORM_URL_VENDOR is not set");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // Zoho public forms upload files in TWO steps: stream each file to the
    // staging host first (uploadZohoFile → filepath), then reference those
    // paths in the /records JSON under "<FieldLinkName>-v2" arrays.
    const upload = (file: File, field: string) =>
      uploadZohoFile(file, { formUrl, fieldLinkName: field });

    const bankPath = await upload(bankFile, "FileUpload2");
    if (!bankPath) {
      return NextResponse.json(
        { error: "Bank passbook upload failed" },
        { status: 502 }
      );
    }
    const gstPath =
      gstFile instanceof File && gstFile.size > 0
        ? await upload(gstFile, "FileUpload")
        : null;
    const panPath =
      panFile instanceof File && panFile.size > 0
        ? await upload(panFile, "FileUpload1")
        : null;

    // Submit the record via the JSON /records endpoint. Field keys are the
    // exact Zoho field link names read from the published "Namma office Vendor
    // form". File fields use the "<FieldLinkName>-v2" array convention.
    // Zoho PhoneNumber fields reject "+"/spaces — send digits only.
    const ok = await submitToZohoFormJson(formUrl, {
      SingleLine: data.vendorName, // Vendor Name
      Dropdown: data.category, // Category of service
      SingleLine1: data.gstNumber || undefined, // GST Number (if applicable)
      Website: data.website || undefined, // Website
      SingleLine2: data.companyName, // Company Name
      PhoneNumber: phoneDigits(data.contactPersonPhone), // Contact Person's Phone
      Email: data.contactPersonEmail, // Contact Person's Email
      PhoneNumber1: phoneDigits(data.companyPhone), // Company Phone
      Email1: data.companyEmail, // Company Email
      SingleLine3: data.ifscCode, // IFSC Code
      SingleLine4: data.accountNumber, // Account number
      SingleLine5: data.branchCity, // Branch & City
      SingleLine6: data.panName, // Company PAN card name
      SingleLine7: data.panNumber, // PAN number
      SingleLine8: data.bankName, // Bank name
      SingleLine9: data.accountHolderName, // Account holder name
      SingleLine10: data.companyAddress, // Company Address
      MultiLine: data.serviceSpecialization, // Service & specialization
      MultiLine1: data.comments || undefined, // Additional Inquiries or Comments
      TermsConditions: data.agreeTerms === "true" ? "true" : "false", // Terms
      "FileUpload2-v2": [bankPath], // Bank passbook (required)
      ...(gstPath ? { "FileUpload-v2": [gstPath] } : {}), // GST Documents
      ...(panPath ? { "FileUpload1-v2": [panPath] } : {}), // PAN card
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Submission could not be delivered" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Vendor onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
