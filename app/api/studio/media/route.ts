import { z } from "zod";
import { requireActor,originCheck,boundedBytes,response,failure,throttle,StudioError } from "@/lib/studio/access";
import { listMedia,uploadMedia } from "@/lib/studio/media";
export const runtime="nodejs";
export async function GET(request:Request){try{const actor=await requireActor(request),p=new URL(request.url).searchParams;return response(await listMedia(actor,z.coerce.number().int().min(1).max(10000).parse(p.get("page")||1),(p.get("q")||"").slice(0,100),p.get("trash")==="true"));}catch(error){return failure(error);}}
export async function POST(request:Request){try{
  originCheck(request);const actor=await requireActor(request);await throttle(`upload:${actor.id}`,15);
  const bytes=await boundedBytes(request,10*1024*1024+64*1024);
  const form=await new Request(request.url,{method:"POST",headers:{"content-type":request.headers.get("content-type")||""},body:bytes}).formData();
  const file=form.get("file");if(!(file instanceof File))throw new StudioError("Choose an image.");
  const purpose=z.enum(["logo","image"]).parse(form.get("purpose"));
  let options:unknown;try{options=JSON.parse(String(form.get("options")||"{}"));}catch{throw new StudioError("Invalid image adjustments.");}
  return response(await uploadMedia(actor,file,purpose,options),202);
}catch(error){return failure(error);}}
