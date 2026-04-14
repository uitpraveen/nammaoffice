import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, name, phone, email, services, message } = body;

    if (!businessName || !name || !phone || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const servicesList = Array.isArray(services) ? services.join(", ") : (services || "—");

    const html = `
      <h2>New Virtual Office Enquiry</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Business Name</td><td>${businessName}</td></tr>
        <tr><td>Contact Name</td><td>${name}</td></tr>
        <tr><td>Phone</td><td>${phone}</td></tr>
        <tr><td>Email</td><td>${email}</td></tr>
        <tr><td>Services</td><td>${servicesList}</td></tr>
        <tr><td>Message</td><td>${message || "—"}</td></tr>
      </table>
    `;

    await sendNotificationEmail({
      subject: `Virtual Office Enquiry: ${businessName}`,
      html,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Virtual office API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
