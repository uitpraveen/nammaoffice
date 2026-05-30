/**
 * Shared form-validation helpers so every form validates phone/email the
 * same way (avoids per-form drift). Phone accepts Indian + international
 * formats by counting digits; email uses the same permissive pattern the
 * API routes already use, trimmed so " a@b.com " isn't falsely rejected.
 */
export const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (v: string) => EMAIL_RX.test(v.trim());

/** Strip everything that isn't a digit (drops +, spaces, dashes, parens). */
export const phoneDigits = (v: string) => v.replace(/\D/g, "");

/** A usable phone has 10–13 digits (10-digit local up to +91 / longer intl). */
export const isValidPhone = (v: string) => {
  const d = phoneDigits(v);
  return d.length >= 10 && d.length <= 13;
};
