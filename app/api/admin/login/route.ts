import {
  SESSION_COOKIE,
  adminIsConfigured,
  createSessionValue,
  passwordIsCorrect,
  sessionCookieOptions,
} from "@/lib/admin/auth";
import {
  adminFailure,
  adminResponse,
  checkOrigin,
  jsonBody,
} from "@/lib/admin/http";
import { AdminError } from "@/lib/admin/errors";
import { rateLimit } from "@/lib/admin/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    if (!adminIsConfigured())
      throw new AdminError("The admin password has not been configured.", 503);
    // Global bound cannot be bypassed by supplying different forwarded headers.
    await rateLimit("login-global", "staff", 100, 900);
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for") || "unknown"
      : "local";
    await rateLimit("login", ip, 10, 900);
    const { password } = await jsonBody(request);
    if (
      typeof password !== "string" ||
      password.length > 512 ||
      !passwordIsCorrect(password)
    )
      throw new AdminError("That password is not right.", 401);
    const response = adminResponse({ ok: true });
    response.cookies.set(
      SESSION_COOKIE,
      createSessionValue(),
      sessionCookieOptions,
    );
    return response;
  } catch (error) {
    return adminFailure(error);
  }
}
export async function DELETE(request: Request) {
  try {
    checkOrigin(request);
    const response = adminResponse({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", {
      ...sessionCookieOptions,
      maxAge: 0,
    });
    return response;
  } catch (error) {
    return adminFailure(error);
  }
}
