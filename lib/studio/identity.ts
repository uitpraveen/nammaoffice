// Account invitations remain mandatory, even when a domain is allowed.
export function allowedStaffEmail(email:string, env:Record<string,string|undefined>=process.env) {
  const normalized=email.trim().toLowerCase();
  const addresses=(env.CMS_ALLOWED_EMAILS||"").split(",").map(v=>v.trim().toLowerCase()).filter(Boolean);
  const domain=(env.CMS_GOOGLE_WORKSPACE_DOMAIN||"").trim().toLowerCase();
  if(!addresses.length&&!domain)return true; // Existing invited accounts only.
  return addresses.includes(normalized)||Boolean(domain&&normalized.split("@")[1]===domain);
}
export const googleSignInEnabled=()=>Boolean(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET);
