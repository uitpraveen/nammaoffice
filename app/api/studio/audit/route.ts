import { requireActor,response,failure } from "@/lib/studio/access";
import { query } from "@/lib/studio/db";
export async function GET(request:Request){try{await requireActor(request,{admin:true});return response(await query('SELECT a.id,a.action,a.entity_id,a.detail,a.created_at,u.name AS actor FROM studio_audit a LEFT JOIN "user" u ON u.id=a.actor_id ORDER BY a.id DESC LIMIT 100'));}catch(error){return failure(error);}}
