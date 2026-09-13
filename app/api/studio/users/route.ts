import { allowedStaffEmail } from "@/lib/studio/identity";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { requireActor,originCheck,jsonBody,response,failure,StudioError,throttle } from "@/lib/studio/access";
import { query,transaction } from "@/lib/studio/db";
import { auth } from "@/lib/studio/auth";
import { audit } from "@/lib/studio/entries";
import { baseURL } from "@/lib/studio/config";
export async function GET(request:Request){try{await requireActor(request,{admin:true});return response(await query('SELECT id,name,email,role,disabled,"createdAt" FROM "user" ORDER BY "createdAt" DESC LIMIT 200'));}catch(error){return failure(error);}}
export async function POST(request:Request){try{
  originCheck(request);const actor=await requireActor(request,{admin:true});await throttle(`users:${actor.id}`,10);
  const input=z.object({name:z.string().trim().min(2).max(120),email:z.string().email().max(200).transform(v=>v.toLowerCase()),role:z.enum(["admin","editor","author"])}).strict().parse(await jsonBody(request));
  if(!allowedStaffEmail(input.email))throw new StudioError("Use an approved staff email address.",422);
  const [existing]=await query('SELECT id FROM "user" WHERE lower(email)=$1',[input.email]);if(existing)throw new StudioError("This email already has an account.",409);
  const created=await auth.api.signUpEmail({body:{name:input.name,email:input.email,password:randomBytes(32).toString("base64url")}});
  await transaction(async db=>{await db.query('UPDATE "user" SET role=$2 WHERE id=$1',[created.user.id,input.role]);await audit(db,actor,"user.invite",created.user.id,{email:input.email,role:input.role});});
  try{await auth.api.requestPasswordReset({body:{email:input.email,redirectTo:`${baseURL()}/admin/reset-password`}});}
  catch{return response({ok:true,warning:"Account created, but the invitation could not be delivered. Use Send password link after checking mail settings."},201);}
  return response({ok:true,localMail:process.env.CMS_MAIL_MODE==="local"},201);
}catch(error){return failure(error);}}
export async function PATCH(request:Request){try{
  originCheck(request);const actor=await requireActor(request,{admin:true});
  const input=z.object({id:z.string().min(1).max(100),action:z.enum(["role","disable","enable","revoke","reset"]),role:z.enum(["admin","editor","author"]).optional()}).strict().parse(await jsonBody(request));
  await transaction(async db=>{
    await db.query("SELECT pg_advisory_xact_lock(934876)");
    const {rows:[target]}=await db.query('SELECT * FROM "user" WHERE id=$1 FOR UPDATE',[input.id]);if(!target)throw new StudioError("User not found.",404);
    if((input.action==="disable" || input.action==="role"&&input.role!=="admin")&&target.role==="admin"&&!target.disabled){const {rows:[count]}=await db.query('SELECT count(*) FROM "user" WHERE role=\'admin\' AND disabled=false');if(Number(count.count)<=1)throw new StudioError("Keep at least one active administrator.",409);}
    if(input.action==="disable"&&input.id===actor.id)throw new StudioError("You cannot disable your own account.",409);
    if(input.action==="role"){if(!input.role)throw new StudioError("Choose a role.");await db.query('UPDATE "user" SET role=$2,"updatedAt"=now() WHERE id=$1',[input.id,input.role]);}
    if(input.action==="disable"||input.action==="enable")await db.query('UPDATE "user" SET disabled=$2,"updatedAt"=now() WHERE id=$1',[input.id,input.action==="disable"]);
    if(["role","disable","revoke"].includes(input.action))await db.query('DELETE FROM "session" WHERE "userId"=$1',[input.id]);
    await audit(db,actor,`user.${input.action}`,input.id,{role:input.role});
  });
  if(input.action==="reset"){const [target]=await query<{email:string}>('SELECT email FROM "user" WHERE id=$1',[input.id]);await auth.api.requestPasswordReset({body:{email:target.email,redirectTo:`${baseURL()}/admin/reset-password`}});}
  return response({ok:true});
}catch(error){return failure(error);}}
