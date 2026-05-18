import { NextResponse } from "next/server";
import { submitToZohoForm } from "@/lib/zoho";

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

    // Forward to Zoho Forms. Set ZOHO_FORM_URL_VENDOR and replace the
    // placeholder keys below with the actual Zoho field IDs from the
    // published Vendor Onboarding form.
    const ok = await submitToZohoForm(process.env.ZOHO_FORM_URL_VENDOR, {
      // TODO: replace each key below with the matching Zoho field name.
      Name_First: data.vendorName,
      Dropdown: data.category,
      SingleLine: data.companyName,
      Website: data.website,
      MultiLine: data.companyAddress,
      MultiLine1: data.serviceSpecialization,
      PhoneNumber_countrycodeval: data.contactPersonPhone,
      Email: data.contactPersonEmail,
      PhoneNumber1_countrycodeval: data.companyPhone,
      Email1: data.companyEmail,
      SingleLine1: data.gstNumber,
      SingleLine2: data.panName,
      SingleLine3: data.panNumber,
      SingleLine4: data.bankName,
      SingleLine5: data.accountHolderName,
      Number: data.accountNumber,
      SingleLine6: data.ifscCode,
      SingleLine7: data.branchCity,
      MultiLine2: data.comments,
      FileUpload:
        gstFile instanceof File && gstFile.size > 0 ? gstFile : undefined,
      FileUpload1:
        panFile instanceof File && panFile.size > 0 ? panFile : undefined,
      FileUpload2: bankFile,
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
