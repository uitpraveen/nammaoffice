import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, companyType, numberOfDirectors, name, phone, email, message } = body;

    if (!companyName || !companyType || !name || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = `
      <h2>New Company Registration Enquiry</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Company Name</td><td>${companyName}</td></tr>
        <tr><td>Company Type</td><td>${companyType}</td></tr>
        <tr><td>Number of Directors</td><td>${numberOfDirectors || "—"}</td></tr>
        <tr><td>Contact Name</td><td>${name}</td></tr>
        <tr><td>Phone</td><td>${phone}</td></tr>
        <tr><td>Email</td><td>${email}</td></tr>
        <tr><td>Message</td><td>${message || "—"}</td></tr>
      </table>
    `;

    await sendNotificationEmail({
      subject: `Company Registration Enquiry: ${companyName}`,
      html,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Company registration API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
