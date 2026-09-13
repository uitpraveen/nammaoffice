import { z } from "zod";
import { requireActor,originCheck,jsonBody,response,failure,throttle,editorOnly } from "@/lib/studio/access";
import { kindSchema,uuid } from "@/lib/studio/validation";
import { listEntries,saveEntry } from "@/lib/studio/entries";
export async function GET(request:Request){try{
  const actor=await requireActor(request),p=new URL(request.url).searchParams,kind=kindSchema.parse(p.get("kind"));if(["logo","testimonial","promotion"].includes(kind))editorOnly(actor);
  const page=z.coerce.number().int().min(1).max(10000).parse(p.get("page")||1);return response(await listEntries(actor,kind,page,(p.get("q")||"").slice(0,100),p.get("trash")==="true"));
}catch(error){return failure(error);}}
export async function POST(request:Request){try{
  originCheck(request);const actor=await requireActor(request);await throttle(`save:${actor.id}`,120);
  const input=z.object({id:uuid,kind:kindSchema,version:z.number().int().min(0),data:z.unknown(),autosave:z.boolean().optional()}).strict().parse(await jsonBody(request));
  return response(await saveEntry(actor,input));
}catch(error){return failure(error);}}
