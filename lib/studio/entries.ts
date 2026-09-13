import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { query, transaction } from "./db";
import { assertEdit, editorOnly, StudioError, type Actor } from "./access";
import { entryDataSchema, mediaIds, validatePublication, type EntryData, type Kind } from "./validation";
export type Entry = { id:string; kind:Kind; owner_id:string|null; draft:EntryData; workflow:string; version:number; published_revision:string|null; scheduled_revision:string|null; scheduled_at:string|null; deleted_at:string|null; created_at:string; updated_at:string };
export async function audit(db: PoolClient, actor: Actor|null, action:string, id:string|null, detail:unknown = {}) { await db.query("INSERT INTO studio_audit(actor_id,action,entity_id,detail) VALUES($1,$2,$3,$4)",[actor?.id ?? null,action,id,JSON.stringify(detail)]); }
async function revision(db:PoolClient, e:Entry, actor:Actor|null, reason:string) { const id=randomUUID(); await db.query("INSERT INTO studio_revisions(id,entry_id,data,actor_id,reason) VALUES($1,$2,$3,$4,$5)",[id,e.id,JSON.stringify(e.draft),actor?.id??null,reason]);return id; }
export async function syncMedia(db:PoolClient,id:string,data:EntryData,scope:string,actor:Actor|null) {
  const ids=mediaIds(data);
  if(ids.length){
    const {rows}=await db.query("SELECT id,owner_id,status FROM studio_media WHERE id=ANY($1::uuid[]) FOR SHARE",[ids]);
    if(rows.length!==ids.length || rows.some(m=>m.status!=="ready")) throw new StudioError("Choose images that have finished processing and are not in trash.",422);
    if(actor?.role==="author" && rows.some(m=>m.owner_id!==actor.id))throw new StudioError("You can only attach media from your own library.",403);
  }
  await db.query("DELETE FROM studio_media_usage WHERE entry_id=$1 AND scope=$2",[id,scope]);
  for(const mediaId of ids)await db.query("INSERT INTO studio_media_usage(entry_id,media_id,scope) VALUES($1,$2,$3)",[id,mediaId,scope]);
}
async function reserveSlug(db:PoolClient,e:Entry){
  if(!e.draft.slug || ["logo","testimonial","promotion"].includes(e.kind))return;
  await db.query("INSERT INTO studio_slugs(kind,slug,entry_id) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",[e.kind,e.draft.slug,e.id]);
  const {rows:[held]}=await db.query("SELECT entry_id FROM studio_slugs WHERE kind=$1 AND slug=$2",[e.kind,e.draft.slug]);
  if(held.entry_id!==e.id)throw new StudioError("Another article already owns this URL, including its redirect history.",409);
}
export async function listEntries(actor:Actor,kind:Kind,page=1,search="",trash=false){
  const values=[kind,actor.role==="author"?actor.id:null,`%${search}%`,trash,25,(page-1)*25];
  const rows=await query<Entry & {total:string}>(`SELECT *,count(*) OVER() AS total FROM studio_entries WHERE kind=$1 AND ($2::text IS NULL OR owner_id=$2) AND (COALESCE(draft->>'title','') ILIKE $3 OR COALESCE(draft->>'name','') ILIKE $3) AND (deleted_at IS NOT NULL)=$4 ORDER BY updated_at DESC LIMIT $5 OFFSET $6`,values);
  return {items:rows,total:Number(rows[0]?.total??0),page};
}
export async function getEntry(actor:Actor,id:string){const [e]=await query<Entry>("SELECT * FROM studio_entries WHERE id=$1",[id]);if(!e)throw new StudioError("Content not found.",404);assertEdit(actor,e);return e;}
export async function saveEntry(actor:Actor,input:{id:string;kind:Kind;version:number;data:unknown;autosave?:boolean}){
  if(actor.role==="author" && ["logo","testimonial","promotion"].includes(input.kind))throw new StudioError("An editor manages logos, testimonials and hero promotions.",403);
  let data:EntryData;try{data=entryDataSchema.parse(input.data);}catch(error){if(error instanceof Error && error.name!=="ZodError")throw new StudioError(error.message,422);throw error;}
  return transaction(async db=>{
    let {rows:[e]}=await db.query<Entry>("SELECT * FROM studio_entries WHERE id=$1 FOR UPDATE",[input.id]);
    if(e){assertEdit(actor,e);if(e.kind!==input.kind)throw new StudioError("Content type cannot be changed.",409);if(e.version!==input.version)throw new StudioError("Someone saved a newer version. Reload before editing again.",409);if(e.deleted_at)throw new StudioError("Restore this content from trash before editing.",409);}
    else{if(input.version!==0)throw new StudioError("Content no longer exists.",404);const r=await db.query<Entry>("INSERT INTO studio_entries(id,kind,owner_id,draft) VALUES($1,$2,$3,$4) RETURNING *",[input.id,input.kind,actor.id,JSON.stringify(data)]);e=r.rows[0];}
    if(data.slug){const {rows:[held]}=await db.query("SELECT entry_id FROM studio_slugs WHERE kind=$1 AND slug=$2",[input.kind,data.slug]);if(held && held.entry_id!==e.id)throw new StudioError("This URL belongs to another article.",409);}
    e.draft=data;
    await syncMedia(db,e.id,data,"draft",actor);
    await revision(db,e,actor,input.autosave?"Autosave":"Saved draft");
    // Editing invalidates a scheduled revision. The published revision is untouched.
    await db.query("DELETE FROM studio_media_usage WHERE entry_id=$1 AND scope='scheduled'",[e.id]);
    const {rows:[saved]}=await db.query<Entry>("UPDATE studio_entries SET draft=$2,version=version+1,workflow='draft',scheduled_revision=NULL,scheduled_at=NULL,updated_at=now() WHERE id=$1 RETURNING *",[e.id,JSON.stringify(data)]);
    if(!input.autosave)await audit(db,actor,"entry.save",e.id,{kind:e.kind});
    return saved;
  });
}
async function publishLocked(db:PoolClient,e:Entry,actor:Actor|null,revisionId?:string){
  try{validatePublication(e.kind,e.draft);}catch(error){throw new StudioError((error as Error).message,422);}
  await reserveSlug(db,e);await syncMedia(db,e.id,e.draft,"published",null);
  const rev=revisionId??await revision(db,e,actor,"Published");
  await db.query("DELETE FROM studio_media_usage WHERE entry_id=$1 AND scope='scheduled'",[e.id]);
  await db.query("UPDATE studio_entries SET published_revision=$2,scheduled_revision=NULL,scheduled_at=NULL,workflow='published',version=version+1,updated_at=now() WHERE id=$1",[e.id,rev]);
  await audit(db,actor,"entry.publish",e.id,{kind:e.kind,slug:e.draft.slug});
}
export async function entryAction(actor:Actor,id:string,version:number,action:string,extra:{revisionId?:string;scheduledAt?:string}={}){
  return transaction(async db=>{
    const {rows:[e]}=await db.query<Entry>("SELECT * FROM studio_entries WHERE id=$1 FOR UPDATE",[id]);
    if(!e)throw new StudioError("Content not found.",404);assertEdit(actor,e);
    if(e.version!==version)throw new StudioError("This content changed. Reload before trying again.",409);
    if(e.deleted_at && action!=="restore-trash")throw new StudioError("Restore this item from trash first.",409);
    if(!["review","restore-revision"].includes(action))editorOnly(actor);
    if(action==="publish")await publishLocked(db,e,actor);
    else if(action==="schedule"){
      try{validatePublication(e.kind,e.draft);}catch(error){throw new StudioError((error as Error).message,422);}
      const at=new Date(extra.scheduledAt||"");if(!Number.isFinite(at.getTime())||at.getTime()<Date.now()+30000)throw new StudioError("Schedule at least a minute into the future.",422);
      if(e.kind==="promotion" && at.getTime()>=Date.parse(e.draft.endsAt))throw new StudioError("Schedule publication before the poster display ends.",422);
      await reserveSlug(db,e);await syncMedia(db,e.id,e.draft,"scheduled",actor);
      const rev=await revision(db,e,actor,"Scheduled");
      await db.query("UPDATE studio_entries SET scheduled_revision=$2,scheduled_at=$3,workflow='scheduled',version=version+1,updated_at=now() WHERE id=$1",[id,rev,at]);
    }else if(action==="review")await db.query("UPDATE studio_entries SET workflow='review',version=version+1,updated_at=now() WHERE id=$1",[id]);
    else if(action==="archive" || action==="trash"){
      await db.query("UPDATE studio_entries SET published_revision=NULL,scheduled_revision=NULL,scheduled_at=NULL,workflow='archived',deleted_at=CASE WHEN $2 THEN now() ELSE deleted_at END,version=version+1,updated_at=now() WHERE id=$1",[id,action==="trash"]);
      await db.query("DELETE FROM studio_media_usage WHERE entry_id=$1 AND scope IN ('published','scheduled')",[id]);
    }else if(action==="restore-trash")await db.query("UPDATE studio_entries SET deleted_at=NULL,workflow='draft',version=version+1,updated_at=now() WHERE id=$1",[id]);
    else if(action==="cancel-schedule"){
      await db.query("UPDATE studio_entries SET scheduled_revision=NULL,scheduled_at=NULL,workflow='draft',version=version+1,updated_at=now() WHERE id=$1",[id]);
      await db.query("DELETE FROM studio_media_usage WHERE entry_id=$1 AND scope='scheduled'",[id]);
    }else if(action==="restore-revision"){
      const {rows:[rev]}=await db.query("SELECT data FROM studio_revisions WHERE id=$1 AND entry_id=$2",[extra.revisionId,id]);
      if(!rev)throw new StudioError("Revision not found.",404);e.draft=entryDataSchema.parse(rev.data);await syncMedia(db,id,e.draft,"draft",actor);await revision(db,e,actor,"Restored revision");
      await db.query("UPDATE studio_entries SET draft=$2,workflow='draft',scheduled_revision=NULL,scheduled_at=NULL,version=version+1,updated_at=now() WHERE id=$1",[id,JSON.stringify(e.draft)]);
      await db.query("DELETE FROM studio_media_usage WHERE entry_id=$1 AND scope='scheduled'",[id]);
    }else throw new StudioError("Unknown content action.");
    await audit(db,actor,`entry.${action}`,id);
    return (await db.query<Entry>("SELECT * FROM studio_entries WHERE id=$1",[id])).rows[0];
  });
}
export async function publishDue(){
  return transaction(async db=>{
    const {rows}=await db.query<Entry>("SELECT * FROM studio_entries WHERE scheduled_at<=now() AND scheduled_revision IS NOT NULL AND deleted_at IS NULL FOR UPDATE SKIP LOCKED");
    for(const e of rows){const {rows:[rev]}=await db.query("SELECT data FROM studio_revisions WHERE id=$1",[e.scheduled_revision]);if(!rev)continue;e.draft=entryDataSchema.parse(rev.data);await publishLocked(db,e,null,e.scheduled_revision!);}
    return rows.length;
  });
}
export async function revisions(actor:Actor,id:string){await getEntry(actor,id);return query("SELECT r.id,r.reason,r.created_at,r.data,u.name AS actor FROM studio_revisions r LEFT JOIN \"user\" u ON u.id=r.actor_id WHERE entry_id=$1 ORDER BY r.created_at DESC LIMIT 100",[id]);}
