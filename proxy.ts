import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin/auth";

/**
 * Next 16 renamed `middleware` to `proxy`. This runs before /admin and the
 * admin API, and bounces anyone without a session to the login page.
 *
 * The signature is only checked here cheaply (presence + expiry); the HMAC is
 * verified in the route handlers, because proxy code is meant to stay free of
 * shared server modules and may run on the edge.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const looksValid = Boolean(cookie && Number(cookie.split(".")[0]) > Date.now());
  if (looksValid) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
