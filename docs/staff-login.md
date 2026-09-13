# Staff login: passwords and Google

Local review: http://127.0.0.1:3001/admin/login. Each account uses its email address as the username. Password login works now. CMS two-factor authentication is removed, including enrollment/challenge endpoints. The upgrade clears old authenticator secrets and signs out formerly enrolled sessions, preserving all accounts and passwords. Google may apply its own account verification policies.

Staff access remains invitation-only. An administrator creates the email and assigns author, editor or administrator in **Team & access**. No Google account can register itself or grant itself a role. A verified Google email can claim its existing invitation without setting a password first. Setting a password through the invitation/reset link enables the password option on the same account. Disabling a staff account blocks both methods and revokes sessions.

## Enable real Google sign-in

1. Create a Google Cloud OAuth **Web application** client. Register this exact local redirect URI: `http://127.0.0.1:3001/api/auth/callback/google`. Add the final HTTPS VPS callback separately when ready.
2. Put `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` privately in `.env.development.local`. Do not paste secrets into source files or documentation. Restart the local app. The Google button appears only when both values are present.
3. For company Google Workspace identities, configure `CMS_GOOGLE_WORKSPACE_DOMAIN` with the exact domain. Google's returned hosted-domain claim must match. For individual consumer Gmail accounts, leave that variable blank and set `CMS_ALLOWED_EMAILS` to a comma-separated list of exact approved addresses. Never use `gmail.com` as a company-domain restriction.
4. Invite each permitted email through the administrator portal. A permitted domain/address alone does not create an account. Test with a permitted invited account and an uninvited account before production.

If neither restriction variable is set, **only existing administrator-created invitations/accounts** can sign in. No company domain has been guessed. The email restriction applies to password login and existing sessions too. Include the real bootstrap administrator when introducing a restriction; local fictional demo accounts will be excluded by a real company-only policy. When a Workspace domain is configured, consumer Google accounts are rejected even if individually listed; use a pure exact-address list instead if the staff team mixes consumer Gmail and Workspace accounts.

The OAuth integration follows [Better Auth's Google provider documentation](https://better-auth.com/docs/authentication/google). Only identity scopes are requested; this does not grant the website access to staff Gmail inboxes. The local verification suite uses locally signed token fixtures with a substituted signing-key lookup to test account linking, signature/audience validation and access policies. It does not prove that your real Google Cloud credentials and callback configuration work; that final check requires those credentials.

## Email delivery

Google sign-in and sending invitation/password-reset emails are separate. Current local mail is written to the private outbox and viewable by administrators in **Team & access → Local mail**. No actual email is sent. For real delivery, configure `CMS_MAIL_MODE=resend`, `CMS_MAIL_FROM` and `RESEND_API_KEY` with a verified sender, then test delivery when authorized. OAuth secrets and mail credentials stay server-side.
