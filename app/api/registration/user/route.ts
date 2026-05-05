import { NextResponse } from "next/server";
import { sendNotificationEmail, emailShell, renderRows } from "@/lib/email";
import { uploadFile, fileLinkHtml } from "@/lib/blob";

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
    const aadhaar =
      aadhaarFile instanceof File && aadhaarFile.size > 0
        ? await uploadFile(aadhaarFile, "user-registration/aadhaar")
        : null;

    const html = emailShell(
      `User Registration — ${data.name || "(no name)"}`,
      "Member onboarding",
      renderRows({
        Name: data.name,
        "Date of Birth": data.dob,
        Phone: data.phone,
        Email: data.email,
        "Company Name": data.companyName,
        "Bike Number": data.bikeNumber,
        "Car Number": data.carNumber,
        "T-shirt Size": data.tshirtSize,
        Gender: data.gender,
        Address: data.address,
        "Aadhaar Card": aadhaar ? fileLinkHtml(aadhaar) : "—",
        "Facilities Required": data.facilities,
        Comments: data.comments,
      })
    );

    await sendNotificationEmail({
      subject: `[USER REGISTRATION] ${data.name || data.email || data.phone || "New member"}`,
      html,
      replyTo: data.email || undefined,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("User registration error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
