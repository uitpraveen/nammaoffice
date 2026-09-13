import { requireActor,response,failure } from "@/lib/studio/access";
import { query } from "@/lib/studio/db";
import { googleSignInEnabled } from "@/lib/studio/identity";
export async function GET(request:Request){try{const actor=await requireActor(request);
  const counts=await query("SELECT kind,count(*)::int AS total,count(*) FILTER(WHERE published_revision IS NOT NULL)::int AS published,count(*) FILTER(WHERE workflow='review')::int AS review FROM studio_entries WHERE deleted_at IS NULL AND ($1::text IS NULL OR owner_id=$1) GROUP BY kind",[actor.role==="author"?actor.id:null]);
  const [worker]=await query<{value:string}>("SELECT value FROM studio_meta WHERE key='worker-heartbeat'");
  return response({actor,googleSignInEnabled:googleSignInEnabled(),counts,workerHealthy:Boolean(worker&&Date.now()-new Date(worker.value).getTime()<30000),localMail:process.env.CMS_MAIL_MODE==="local"});
}catch(error){return failure(error);}}
