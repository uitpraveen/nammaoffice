import { promises as fs } from "node:fs";
import { uuid } from "@/lib/studio/validation";
import { query } from "@/lib/studio/db";
import { requireActor } from "@/lib/studio/access";
import { mediaPath,type Media } from "@/lib/studio/media";
export const runtime="nodejs";
export async function GET(request:Request,ctx:{params:Promise<{id:string;variant:string}>}){
  const {id,variant}=await ctx.params;
  if(!uuid.safeParse(id).success||!["thumb","display","original"].includes(variant))return new Response(null,{status:404});
  try{
    const [m]=await query<Media & {public:boolean}>("SELECT m.*,EXISTS(SELECT 1 FROM studio_media_usage u JOIN studio_entries e ON e.id=u.entry_id WHERE u.media_id=m.id AND u.scope='published' AND e.published_revision IS NOT NULL AND e.deleted_at IS NULL) AS public FROM studio_media m WHERE m.id=$1 AND m.status='ready'",[id]);
    if(!m)return new Response(null,{status:404});
    const publicFile=m.public&&variant!=="original";
    if(!publicFile){const actor=await requireActor(request).catch(()=>null);if(!actor||actor.role==="author"&&m.owner_id!==actor.id)return new Response(null,{status:404,headers:{"Cache-Control":"no-store"}});}
    const bytes=await fs.readFile(mediaPath(id,variant));
    return new Response(bytes,{headers:{"Content-Type":variant==="original"?"application/octet-stream":"image/webp","Content-Length":String(bytes.length),"Cache-Control":publicFile?"public, max-age=60":"private, no-store","X-Content-Type-Options":"nosniff",...(variant==="original"?{"Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(m.filename)}`}:{})}});
  }catch(error){console.error("Media delivery failed",(error as Error).message);return new Response(null,{status:503,headers:{"Cache-Control":"no-store"}});}
}
