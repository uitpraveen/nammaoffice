import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { city, location, workspaceTypes, date, timeSlot, name, email, phone, company, message } = body;

    if (!city || !location || !date || !timeSlot || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const workspaceList = Array.isArray(workspaceTypes) ? workspaceTypes.join(", ") : (workspaceTypes || "—");

    const html = `
      <h2>New Tour Booking Request</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>City</td><td>${city}</td></tr>
        <tr><td>Location</td><td>${location}</td></tr>
        <tr><td>Workspace Types</td><td>${workspaceList}</td></tr>
        <tr><td>Date</td><td>${date}</td></tr>
        <tr><td>Time Slot</td><td>${timeSlot}</td></tr>
        <tr><td>Name</td><td>${name}</td></tr>
        <tr><td>Email</td><td>${email}</td></tr>
        <tr><td>Phone</td><td>${phone}</td></tr>
        <tr><td>Company</td><td>${company || "—"}</td></tr>
        <tr><td>Message</td><td>${message || "—"}</td></tr>
      </table>
    `;

    await sendNotificationEmail({
      subject: `Tour Booking: ${name} — ${location} on ${date}`,
      html,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Book tour API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
