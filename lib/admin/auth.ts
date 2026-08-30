import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Password gate for /admin.
 *
 * One shared password, held in ADMIN_PASSWORD, exchanged for a signed cookie.
 * Deliberately not a user system: the people managing logos are a handful of
 * staff, and accounts would be more to maintain than the feature is worth.
 *
 * The cookie carries an expiry and an HMAC over it, so it cannot be forged or
 * extended without the secret. It is httpOnly, so page scripts cannot read it.
 */
export const SESSION_COOKIE = "no_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD is not set, so the admin area cannot be opened.");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function passwordIsCorrect(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

export function createSessionValue() {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  return `${expires}.${sign(String(expires))}`;
}

export function sessionIsValid(value: string | undefined) {
  if (!value) return false;
  const [expires, mac] = value.split(".");
  if (!expires || !mac) return false;
  if (Number(expires) < Date.now()) return false;
  try {
    return safeEqual(mac, sign(expires));
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};

/** True when the admin area is usable at all. */
export const adminIsConfigured = () => Boolean(process.env.ADMIN_PASSWORD);
