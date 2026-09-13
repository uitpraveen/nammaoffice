import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { query } from "./db";
import { trustedOrigins } from "./config";
import { allowedStaffEmail } from "./identity";
import type { Kind, Role } from "./validation";
export class StudioError extends Error { constructor(message: string, public status = 400) { super(message); } }
export type Actor = { id: string; name: string; email: string; role: Role };
export async function actorFromHeaders(h: Headers): Promise<Actor | null> {
  const session = await auth.api.getSession({ headers: h });
  if (!session) return null;
  const [user] = await query<Actor & { disabled: boolean }>('SELECT id,name,email,role,disabled FROM "user" WHERE id=$1', [session.user.id]);
  return user && !user.disabled && allowedStaffEmail(user.email) && ["admin","editor","author"].includes(user.role) ? user : null;
}
export async function requireActor(request?: Request, options: { admin?: boolean } = {}) {
  const actor = await actorFromHeaders(request?.headers ?? await headers());
  if (!actor) throw new StudioError("Your session expired. Please sign in.", 401);
  if (options.admin && actor.role !== "admin") throw new StudioError("Administrator access is required.", 403);
  return actor;
}
export async function requirePage() {
  const actor = await actorFromHeaders(await headers());
  if (!actor) redirect("/admin/login");
  return actor;
}
export function canEdit(actor: Actor, entry: { kind: Kind; owner_id: string | null }) {
  return actor.role !== "author" || entry.owner_id === actor.id && ["blog","news","case-study"].includes(entry.kind);
}
export function editorOnly(actor: Actor) { if (actor.role === "author") throw new StudioError("An editor must review and publish this change.",403); }
export function assertEdit(actor: Actor, entry: {kind: Kind; owner_id: string | null}) { if (!canEdit(actor,entry)) throw new StudioError("You cannot edit this content.",403); }
export function originCheck(request: Request) {
  if (!trustedOrigins().includes(request.headers.get("origin")||"") || request.headers.get("sec-fetch-site") === "cross-site") throw new StudioError("This request must come from the admin website.",403);
}
export async function boundedBytes(request: Request, max: number) {
  if (Number(request.headers.get("content-length")) > max) throw new StudioError("This upload is too large.",413);
  const chunks: Uint8Array[] = []; let size = 0; const reader = request.body?.getReader();
  if (reader) for (;;) { const {done,value} = await reader.read(); if (done) break; size += value.byteLength; if (size > max) { await reader.cancel(); throw new StudioError("This upload is too large.",413); } chunks.push(value); }
  return Buffer.concat(chunks);
}
export async function jsonBody(request: Request) {
  try { return JSON.parse((await boundedBytes(request,256*1024)).toString("utf8")); }
  catch(error) { if(error instanceof StudioError) throw error; throw new StudioError("Send valid JSON."); }
}
export function response(data: unknown, status = 200) { return Response.json(data,{status,headers:{"Cache-Control":"private, no-store"}}); }
export function failure(error: unknown) {
  if (error instanceof StudioError) return response({error:error.message},error.status);
  const e = error as { name?: string; code?: string; issues?: {message:string}[] };
  if(e.name === "ZodError") return response({error:e.issues?.[0]?.message || "Check the entered values."},422);
  if(e.code === "23505") return response({error:"This name or URL is already in use. Choose another."},409);
  console.error("Studio request failed", error);
  return response({error:"The operation could not be completed. Reload before retrying."},500);
}
export async function throttle(key: string, max = 30, seconds = 60) {
  const [row] = await query<{count:number}>(`INSERT INTO studio_limits(key,count,reset_at) VALUES($1,1,now()+$2*interval '1 second') ON CONFLICT(key) DO UPDATE SET count=CASE WHEN studio_limits.reset_at<now() THEN 1 ELSE studio_limits.count+1 END,reset_at=CASE WHEN studio_limits.reset_at<now() THEN EXCLUDED.reset_at ELSE studio_limits.reset_at END RETURNING count`,[key,seconds]);
  if(row.count>max) throw new StudioError("Too many requests. Please wait a minute and retry.",429);
}
