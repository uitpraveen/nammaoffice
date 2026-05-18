import { NextResponse } from "next/server";
import { submitToZohoForm } from "@/lib/zoho";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const fd = await request.formData();
    const data = Object.fromEntries(
      Array.from(fd.entries()).filter(([, v]) => typeof v === "string")
    ) as Record<string, string>;

    if (!data.dob) {
      return NextResponse.json({ error: "Date of birth is required" }, { status: 400 });
    }
    if (data.agreeTerms !== "true") {
      return NextResponse.json({ error: "Terms must be accepted" }, { status: 400 });
    }

    const aadhaarFile = fd.get("aadhaar");

    // Forward to Zoho Forms. Set ZOHO_FORM_URL_USER and replace the
    // placeholder keys below with the actual Zoho field IDs from the
    // published User Registration form.
    const ok = await submitToZohoForm(process.env.ZOHO_FORM_URL_USER, {
      // TODO: replace each key below with the matching Zoho field name.
      Name_First: data.name,
      Date: data.dob,
      PhoneNumber_countrycodeval: data.phone,
      Email: data.email,
      SingleLine: data.companyName,
      SingleLine1: data.bikeNumber,
      SingleLine2: data.carNumber,
      Dropdown: data.tshirtSize,
      Radio: data.gender,
      MultiLine: data.address,
      MultiLine1: data.facilities,
      MultiLine2: data.comments,
      FileUpload:
        aadhaarFile instanceof File && aadhaarFile.size > 0 ? aadhaarFile : undefined,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Submission could not be delivered" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("User registration error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
