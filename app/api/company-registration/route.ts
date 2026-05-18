import { NextResponse } from "next/server";
import { submitToZohoForm } from "@/lib/zoho";

const COMPANY_TYPE_LABELS: Record<string, string> = {
  "private-limited": "Private Limited",
  llp: "LLP",
  partnership: "Partnership",
  "sole-proprietorship": "Sole Proprietorship",
  // NOTE: "OPC" is in our form but not in the Zoho dropdown yet — add it
  // there or remove the option here. Falls back to the raw slug otherwise.
};

/**
 * Split a phone string into Zoho's split phone-field shape.
 * Strips spaces/dashes/parens, takes the last 10 digits as the number,
 * and treats anything before that as the country code (defaults to "+91").
 */
function splitPhone(raw: string): { code: string; number: string } {
  const digits = raw.replace(/\D+/g, "");
  if (digits.length <= 10) return { code: "+91", number: digits };
  const number = digits.slice(-10);
  const code = "+" + digits.slice(0, -10);
  return { code, number };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, companyType, numberOfDirectors, name, phone, email, message } = body;

    if (!companyName || !companyType || !name || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { code, number } = splitPhone(phone);

    const ok = await submitToZohoForm(process.env.ZOHO_FORM_URL_COMPANY, {
      zf_referrer_name: "NammaOffice Website",
      zf_redirect_url: "",
      zc_gad: "",
      SingleLine: companyName,
      Dropdown: COMPANY_TYPE_LABELS[companyType] ?? companyType,
      Number: numberOfDirectors,
      SingleLine1: name,
      // Despite the names, Zoho's split-phone fields are reversed:
      //   `_countrycodeval` carries the country code (e.g. "91")
      //   `_countrycode`    carries the phone digits.
      PhoneNumber_countrycodeval: code,
      PhoneNumber_countrycode: number,
      Email: email,
      MultiLine: message,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Submission could not be delivered" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Company registration API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
