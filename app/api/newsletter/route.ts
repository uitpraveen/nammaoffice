import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = `
      <h2>New Newsletter Subscription</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Email</td><td>${email}</td></tr>
      </table>
    `;

    await sendNotificationEmail({
      subject: `Newsletter Subscription: ${email}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
