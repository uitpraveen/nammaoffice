import "./env";
import { PgBoss } from "pg-boss";
import { query,pool } from "../../lib/studio/db";
import { processMedia } from "../../lib/studio/media";
import { publishDue } from "../../lib/studio/entries";
const boss=new PgBoss({connectionString:process.env.DATABASE_URL!,application_name:"nammaoffice-worker"});
boss.on("error",error=>console.error("Queue error",error.message));
await boss.start();await boss.createQueue("media-process",{policy:"singleton",retryLimit:3,retryDelay:5,expireInSeconds:120});
await boss.work<{id:string}>("media-process",{batchSize:1,pollingIntervalSeconds:1},async jobs=>{for(const job of jobs)await processMedia(job.data.id);});
let ticking=false;
async function tick(){if(ticking)return;ticking=true;try{
  // Durable media rows act as an outbox. If a process stops before enqueuing,
  // another worker finds the row; singleton keys prevent concurrent duplication.
  const pending=await query<{id:string}>("SELECT id FROM studio_media WHERE status='queued' OR (status='processing' AND updated_at<now()-interval '3 minutes') LIMIT 100");
  for(const media of pending)await boss.send("media-process",{id:media.id},{singletonKey:media.id});
  await publishDue();
  await query("INSERT INTO studio_meta(key,value) VALUES('worker-heartbeat',to_jsonb(now())) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value");
  await query("DELETE FROM studio_limits WHERE reset_at<now()-interval '1 day'");
}catch(error){console.error("Worker tick failed",(error as Error).message);}finally{ticking=false;}}
await tick();const interval=setInterval(tick,5000);console.log("NammaOffice worker ready: images and scheduled publishing.");
async function stop(){clearInterval(interval);await boss.stop({graceful:true,timeout:15000});await pool.end();process.exit(0);}
process.on("SIGTERM",stop);process.on("SIGINT",stop);
