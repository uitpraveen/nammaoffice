import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, city, spaceSize, investmentCapacity, message } = body;

    if (!name || !email || !phone || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = `
      <h2>New Franchise Enquiry</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Name</td><td>${name}</td></tr>
        <tr><td>Email</td><td>${email}</td></tr>
        <tr><td>Phone</td><td>${phone}</td></tr>
        <tr><td>City</td><td>${city}</td></tr>
        <tr><td>Space Size</td><td>${spaceSize || "-"}</td></tr>
        <tr><td>Investment Capacity</td><td>${investmentCapacity || "-"}</td></tr>
        <tr><td>Message</td><td>${message || "-"}</td></tr>
      </table>
    `;

    await sendNotificationEmail({
      subject: `Franchise Enquiry from ${name} - ${city}`,
      html,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Franchise API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
