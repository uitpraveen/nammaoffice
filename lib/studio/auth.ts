import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { allowedStaffEmail, googleSignInEnabled } from "./identity";
import { pool } from "./db";
import { baseURL, dataDir, trustedOrigins } from "./config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const auth = betterAuth({
  appName: "NammaOffice Studio",
  baseURL: baseURL(),
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,
  trustedOrigins: trustedOrigins(),
  socialProviders: googleSignInEnabled() ? { google: {
    clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    disableSignUp: true, prompt: "select_account", accessType: "online",
    hd: process.env.CMS_GOOGLE_WORKSPACE_DOMAIN?.trim() || undefined,
    mapProfileToUser: async (profile) => {
      if(profile.email_verified !== true || !allowedStaffEmail(profile.email)) throw new APIError("FORBIDDEN", {message:"Use your invited staff Google account."});
      const {rows:[staff]}=await pool.query('SELECT id FROM "user" WHERE lower(email)=$1 AND disabled=false AND role IN (\'admin\',\'editor\',\'author\')',[profile.email.toLowerCase()]);
      if(!staff)throw new APIError("FORBIDDEN", {message:"Ask an administrator to invite your staff email first."});
      return {email:profile.email.toLowerCase()};
    },
  }} : {},
  // Only administrators can create local accounts. Google's verified email can
  // therefore claim an invitation without first setting a local password.
  account: { accountLinking: { enabled:true, trustedProviders:["google"], requireLocalEmailVerified:false, allowDifferentEmails:false } },
  onAPIError: { errorURL: "/admin/login" },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    // HTTP sign-up is blocked at the auth handler. Only trusted setup/admin
    // services can call the server API to create invited staff accounts.
    disableSignUp: false,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.CMS_MAIL_MODE === "local") {
        const dir = path.join(dataDir(), "mail"); await fs.mkdir(dir, { recursive: true, mode: 0o700 });
        await fs.writeFile(path.join(dir, `${Date.now()}-${randomUUID()}.json`), JSON.stringify({ to: user.email, subject: "Set your NammaOffice password", url, createdAt: new Date().toISOString() }), { mode: 0o600 });
        return;
      }
      // Outbound delivery is opt-in; local work never sends email.
      if (process.env.CMS_MAIL_MODE !== "resend" || !process.env.CMS_MAIL_FROM) throw new Error("Configure CMS mail delivery before requesting password resets.");
      const { Resend } = await import("resend");
      const result = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: process.env.CMS_MAIL_FROM, to: user.email, subject: "Set your NammaOffice password", text: `Use this link to set your password: ${url}\nIf you did not request this, you can ignore this message.` });
      if (result.error) throw new Error("Password email could not be sent.");
    },
  },
  user: { additionalFields: {
    role: { type: "string", defaultValue: "author", input: false },
    disabled: { type: "boolean", defaultValue: false, input: false },
  } },
  databaseHooks: { session: { create: { before: async (session) => {
    const { rows: [user] } = await pool.query('SELECT disabled,email FROM "user" WHERE id=$1', [session.userId]);
    if (!user || user.disabled || !allowedStaffEmail(user.email)) throw new APIError("FORBIDDEN", { message: "This account is disabled. Contact an administrator." });
    return { data: session };
  } } } },
  session: { expiresIn: 60 * 60 * 12, updateAge: 60 * 30, cookieCache: { enabled: false } },
  rateLimit: { enabled: true, storage: "database", window: 60, max: 60, customRules: {
    "/sign-in/email": { window: 900, max: 10 },
    "/request-password-reset": { window: 900, max: 5 },
  } },
  advanced: { useSecureCookies: baseURL().startsWith("https://") },
});
