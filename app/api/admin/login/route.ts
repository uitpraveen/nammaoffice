import { NextResponse } from "next/server";
import {
  SESSION_COOKIE, adminIsConfigured, createSessionValue,
  passwordIsCorrect, sessionCookieOptions,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!adminIsConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on the server." }, { status: 503 });
  }
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !passwordIsCorrect(password)) {
    // Deliberately vague: it should not confirm whether a password merely
    // has the wrong length.
    return NextResponse.json({ error: "That password is not right." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionValue(), sessionCookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
  return response;
}
