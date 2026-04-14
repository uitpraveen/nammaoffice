import { Resend } from "resend";

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "info@nammaoffice.com";

interface EmailOptions {
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendNotificationEmail({ subject, html, replyTo }: EmailOptions) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: "NammaOffice Website <noreply@nammaoffice.com>",
    to: NOTIFICATION_EMAIL,
    subject,
    html,
    replyTo,
  });
}
