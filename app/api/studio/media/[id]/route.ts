import { z } from "zod";
import { requireActor,originCheck,jsonBody,response,failure,StudioError } from "@/lib/studio/access";
import { uuid } from "@/lib/studio/validation";
import { mediaAction,type Media } from "@/lib/studio/media";
import { query } from "@/lib/studio/db";
type Context={params:Promise<{id:string}>};
export async function GET(request:Request,ctx:Context){try{const actor=await requireActor(request),id=uuid.parse((await ctx.params).id);const [m]=await query<Media>("SELECT * FROM studio_media WHERE id=$1",[id]);if(!m||actor.role==="author"&&m.owner_id!==actor.id)throw new StudioError("Image not found.",404);return response(m);}catch(error){return failure(error);}}
export async function PATCH(request:Request,ctx:Context){try{originCheck(request);const actor=await requireActor(request),id=uuid.parse((await ctx.params).id);const data=z.object({action:z.enum(["trash","restore","retry"]),version:z.number().int().positive()}).strict().parse(await jsonBody(request));return response(await mediaAction(actor,id,data.version,data.action));}catch(error){return failure(error);}}
