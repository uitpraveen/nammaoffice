import { NextResponse } from "next/server";
import {
  submitToZohoFormJson,
  uploadZohoFile,
  type ZohoJsonValue,
} from "@/lib/zoho";
import {
  SERVICE_REQUEST_AREAS,
  SERVICE_REQUEST_BRANCHES,
  SERVICE_REQUEST_FLOORS,
} from "@/lib/data/zoho-service-request";
import { phoneDigits } from "@/lib/forms/validators";

export const runtime = "nodejs";
export const maxDuration = 60;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Today's date in Zoho's `dd-MMM-yyyy` configured format (IST). */
function todayIST(): string {
  const fmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  // "22 May 2026" → "22-May-2026"
  return fmt.format(new Date()).replace(/ /g, "-");
}

export async function POST(request: Request) {
  try {
    const fd = await request.formData();

    // Honeypot check.
    if (fd.get("honeypot")) return NextResponse.json({ success: true });

    const get = (k: string) => (fd.get(k) ?? "").toString().trim();
    const companyName = get("companyName");
    const personName = get("personName");
    const phone = get("phone");
    const email = get("email");
    const ccEmail1 = get("ccEmail1");
    const ccEmail2 = get("ccEmail2");
    const ticketTitle = get("ticketTitle");
    const branch = get("branch");
    const area = get("area");
    const areaOther = get("areaOther");
    const floor = get("floor");
    const floorOther = get("floorOther");
    const description = get("description");

    const required: [string, string][] = [
      ["companyName", companyName],
      ["personName", personName],
      ["phone", phone],
      ["email", email],
      ["ticketTitle", ticketTitle],
      ["branch", branch],
      ["area", area],
      ["description", description],
    ];
    for (const [key, val] of required) {
      if (!val) return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
    }
    if (!EMAIL_RX.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (ccEmail1 && !EMAIL_RX.test(ccEmail1)) {
      return NextResponse.json({ error: "Invalid Cc Email 1" }, { status: 400 });
    }
    if (ccEmail2 && !EMAIL_RX.test(ccEmail2)) {
      return NextResponse.json({ error: "Invalid Cc Email 2" }, { status: 400 });
    }
    if (!SERVICE_REQUEST_BRANCHES.includes(branch)) {
      return NextResponse.json({ error: "Unknown branch" }, { status: 400 });
    }
    if (!SERVICE_REQUEST_AREAS.includes(area)) {
      return NextResponse.json({ error: "Unknown area" }, { status: 400 });
    }
    if (area === "Other" && !areaOther) {
      return NextResponse.json({ error: "Area (other) is required" }, { status: 400 });
    }
    if (floor && !SERVICE_REQUEST_FLOORS.includes(floor)) {
      return NextResponse.json({ error: "Unknown floor" }, { status: 400 });
    }
    if (floor === "Other" && !floorOther) {
      return NextResponse.json({ error: "Floor (other) is required" }, { status: 400 });
    }

    const formUrl = process.env.ZOHO_FORM_URL_SERVICE_REQUEST;
    if (!formUrl) {
      console.error("Service request: ZOHO_FORM_URL_SERVICE_REQUEST is not set");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // Attachment (optional): two-step upload (stream → filepath), then
    // reference by path under "FileUpload-v2". Link name is "FileUpload".
    const attachment = fd.get("attachment");
    let attachmentPath: string | null = null;
    if (attachment instanceof File && attachment.size > 0) {
      attachmentPath = await uploadZohoFile(attachment, {
        formUrl,
        fieldLinkName: "FileUpload",
      });
    }

    // Area & Floor share one hidden "other-text" input in Zoho, so the public
    // JSON endpoint can't disambiguate them. Append any "Other" free-text to
    // the description so it's never lost (the dropdown still carries "Other").
    const otherNotes: string[] = [];
    if (area === "Other" && areaOther) otherNotes.push(`[Area - Other]: ${areaOther}`);
    if (floor === "Other" && floorOther) otherNotes.push(`[Floor - Other]: ${floorOther}`);
    const fullDescription = otherNotes.length
      ? `${description}\n\n${otherNotes.join("\n")}`
      : description;

    // Build the JSON record. Field names + hidden auto-default values were
    // captured from the live form's own XHR submit - see the dev notes in
    // `lib/zoho.ts`. Zoho PhoneNumber rejects "+"/spaces, so send digits only.
    const record: Record<string, ZohoJsonValue> = {
      SingleLine: companyName,
      SingleLine1: personName,
      PhoneNumber: phoneDigits(phone),
      Email: email,
      Email1: ccEmail1 || undefined,
      Email2: ccEmail2 || undefined,
      SingleLine2: ticketTitle,
      Dropdown: branch,
      Dropdown1: area,
      Dropdown2: floor || undefined,
      MultiLine: fullDescription,
      // Hidden default fields the live form pre-fills (priority/status/etc.).
      Date: todayIST(),
      SingleLine3: "Medium",
      SingleLine4: "UN AVAILABLE",
      SingleLine5: "",
      SingleLine6: "CLIENT",
      ...(attachmentPath ? { "FileUpload-v2": [attachmentPath] } : {}),
    };

    const ok = await submitToZohoFormJson(formUrl, record);

    if (!ok) {
      return NextResponse.json(
        { error: "Submission could not be delivered" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Service-request API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
