import { NextResponse } from "next/server";
import { submitToZohoFormJson, type ZohoJsonValue } from "@/lib/zoho";
import {
  SERVICE_REQUEST_AREAS,
  SERVICE_REQUEST_BRANCHES,
  SERVICE_REQUEST_FLOORS,
} from "@/lib/data/zoho-service-request";

export const runtime = "nodejs";

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

    // Build the JSON record. Field names + hidden auto-default values were
    // captured from the live form's own XHR submit — see the dev notes in
    // `lib/zoho.ts`.
    const record: Record<string, ZohoJsonValue> = {
      SingleLine: companyName,
      SingleLine1: personName,
      PhoneNumber: phone,
      Email: email,
      Email1: ccEmail1 || "",
      Email2: ccEmail2 || "",
      SingleLine2: ticketTitle,
      Dropdown: branch,
      Dropdown1: area,
      Dropdown2: floor || "",
      MultiLine:
        floor === "Other" && floorOther
          ? `${description}\n\n[Floor — Other]: ${floorOther}`
          : description,
      // Hidden default fields the form auto-attaches. Without these the
      // record is silently rejected.
      Date: todayIST(),
      SingleLine3: "Medium",
      SingleLine4: "UN AVAILABLE",
      SingleLine5: "",
      SingleLine6: "CLIENT",
      "FileUpload-v2": [],
    };
    // Zoho expands "Other" for the Area dropdown via this hidden text field.
    if (area === "Other" && areaOther) {
      record["allow-others-text"] = areaOther;
    }

    const ok = await submitToZohoFormJson(
      process.env.ZOHO_FORM_URL_SERVICE_REQUEST,
      record,
    );

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
