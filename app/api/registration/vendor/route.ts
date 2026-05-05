import { NextResponse } from "next/server";
import { sendNotificationEmail, emailShell, renderRows } from "@/lib/email";
import { uploadFile, fileLinkHtml } from "@/lib/blob";

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

    const [gstDoc, panCard, bankPassbook] = await Promise.all([
      gstFile instanceof File && gstFile.size > 0
        ? uploadFile(gstFile, "vendor/gst")
        : null,
      panFile instanceof File && panFile.size > 0
        ? uploadFile(panFile, "vendor/pan")
        : null,
      bankFile instanceof File && bankFile.size > 0
        ? uploadFile(bankFile, "vendor/bank")
        : null,
    ]);

    if (!bankPassbook) {
      return NextResponse.json({ error: "Bank passbook is required" }, { status: 400 });
    }

    const html = emailShell(
      `Vendor Onboarding — ${data.companyName}`,
      "Procurement",
      renderRows({
        "Vendor Name": data.vendorName,
        "Category of Service": data.category,
        "Company Name": data.companyName,
        Website: data.website,
        "Company Address": data.companyAddress,
        "Service & Specialization": data.serviceSpecialization,
        "Contact Person Phone": data.contactPersonPhone,
        "Contact Person Email": data.contactPersonEmail,
        "Company Phone": data.companyPhone,
        "Company Email": data.companyEmail,
        "GST Number": data.gstNumber,
        "GST Documents": fileLinkHtml(gstDoc),
        "PAN Card Name": data.panName,
        "PAN Number": data.panNumber,
        "PAN Card File": fileLinkHtml(panCard),
        "Bank Name": data.bankName,
        "Account Holder": data.accountHolderName,
        "Account Number": data.accountNumber,
        "IFSC Code": data.ifscCode,
        "Branch & City": data.branchCity,
        "Bank Passbook": fileLinkHtml(bankPassbook),
        Comments: data.comments,
      })
    );

    await sendNotificationEmail({
      subject: `[VENDOR ONBOARDING] ${data.companyName} — ${data.category}`,
      html,
      replyTo: data.contactPersonEmail,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Vendor onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
