import { NextResponse } from "next/server";
/** Authorization is checked against the database in every Studio page/API.
 * Old shared-password endpoints are retired so they cannot write legacy data. */
export function proxy() {
  return NextResponse.json({error:"This legacy admin API has been retired. Use NammaOffice Studio."},{status:410,headers:{"Cache-Control":"no-store"}});
}
export const config={matcher:["/api/admin/:path*"]};
