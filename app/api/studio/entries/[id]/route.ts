import { z } from "zod";
import { requireActor,originCheck,jsonBody,response,failure } from "@/lib/studio/access";
import { uuid } from "@/lib/studio/validation";
import { getEntry,entryAction,revisions } from "@/lib/studio/entries";
type Context={params:Promise<{id:string}>};
export async function GET(request:Request,ctx:Context){try{const actor=await requireActor(request),id=uuid.parse((await ctx.params).id);return response(new URL(request.url).searchParams.has("revisions")?await revisions(actor,id):await getEntry(actor,id));}catch(error){return failure(error);}}
export async function PATCH(request:Request,ctx:Context){try{originCheck(request);const actor=await requireActor(request),id=uuid.parse((await ctx.params).id);const input=z.object({action:z.enum(["publish","schedule","review","archive","trash","restore-trash","restore-revision","cancel-schedule"]),version:z.number().int().positive(),revisionId:uuid.optional(),scheduledAt:z.string().datetime().optional()}).strict().parse(await jsonBody(request));return response(await entryAction(actor,id,input.version,input.action,input));}catch(error){return failure(error);}}
