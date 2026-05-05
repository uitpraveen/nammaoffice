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

/* ---------------- HTML helpers ---------------- */

function escape(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Render an object as a clean two-column HTML table for email. */
export function renderRows(data: Record<string, unknown>): string {
  return Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([key, value]) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #E5E1D6;font-size:13px;color:#475569;width:200px;vertical-align:top;">${escape(key)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E5E1D6;font-size:14px;color:#0F172A;">${escape(value)}</td>
    </tr>`
    )
    .join("");
}

/** Wrap a heading + table body in the brand email shell. */
export function emailShell(heading: string, sublabel: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#FAF7F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(11,37,69,0.08);">
    <div style="background:#0B2545;padding:24px 28px;">
      <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#C8A24A;font-weight:600;">${escape(sublabel)}</p>
      <h1 style="margin:6px 0 0;font-size:22px;color:#FFFFFF;font-weight:700;">${escape(heading)}</h1>
    </div>
    <div style="padding:24px 28px;">
      <table style="width:100%;border-collapse:collapse;">
        ${bodyHtml}
      </table>
    </div>
    <div style="padding:16px 28px;background:#F2EDE0;border-top:1px solid #E5E1D6;">
      <p style="margin:0;font-size:12px;color:#475569;">Submitted via nammaoffice.com — please follow up within 24 hours.</p>
    </div>
  </div>
</body></html>`;
}
