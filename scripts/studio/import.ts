import "./env";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";
import { query, pool } from "../../lib/studio/db";
import type { Actor } from "../../lib/studio/access";
import { saveEntry, entryAction, type Entry } from "../../lib/studio/entries";
import { uploadMedia, processMedia, decodedImage } from "../../lib/studio/media";
import { entryDataSchema, kindSchema, validatePublication } from "../../lib/studio/validation";

// Import deliberately accepts local files only. No production credentials or
// external download URLs are used by this migration tool.
const file=process.argv[2];
if(!file)throw new Error("Usage: npm run cms:import -- /absolute/path/manifest.json [--apply]. Omit --apply for validation only.");
const apply=process.argv.includes("--apply");
const schema=z.object({version:z.literal(1),namespace:z.string().min(1).max(100),entries:z.array(z.object({key:z.string().min(1).max(160),kind:kindSchema,status:z.enum(["draft","published"]).default("draft"),data:z.record(z.string(),z.unknown()),media:z.object({mediaId:z.string().optional(),coverMediaId:z.string().optional(),gallery:z.array(z.string()).max(30).optional()}).strict().optional()}).strict()).max(10000)}).strict();
const manifest=schema.parse(JSON.parse(await fs.readFile(file,"utf8")));
const root=await fs.realpath(path.dirname(path.resolve(file)));
async function localFile(relative:string){
  if(path.isAbsolute(relative))throw new Error("Media paths must be relative to the manifest directory.");
  const actual=await fs.realpath(path.resolve(root,relative));
  if(!actual.startsWith(root+path.sep))throw new Error("Media paths must stay inside the manifest directory.");
  const stat=await fs.stat(actual);if(!stat.isFile()||stat.size>10*1024*1024)throw new Error("Import images must be files under 10 MB.");return actual;
}
const keys=new Set<string>();
for(const item of manifest.entries){if(keys.has(item.key))throw new Error(`Duplicate import key: ${item.key}`);keys.add(item.key);const data=entryDataSchema.parse(item.data);if(item.media?.mediaId)data.mediaId="00000000-0000-4000-a000-000000000000";if(item.media?.coverMediaId)data.coverMediaId="00000000-0000-4000-a000-000000000000";if(item.status==="published")validatePublication(item.kind,data);for(const relative of [item.media?.mediaId,item.media?.coverMediaId,...item.media?.gallery||[]].filter(Boolean) as string[])await decodedImage(await fs.readFile(await localFile(relative)));}
if(!apply){console.log(`Validated ${manifest.entries.length} manifest entries, image bytes and publication requirements. Run with --apply to import.`);process.exit(0);}
const [admin]=await query<Actor>('SELECT id,name,email,role FROM "user" WHERE role=\'admin\' AND disabled=false LIMIT 1');
if(!admin)throw new Error("Run cms:setup before importing.");
for(const item of manifest.entries){
  const digest=createHash("sha256").update(`import:${manifest.namespace}:${item.key}`).digest("hex");
  const id=`${digest.slice(0,8)}-${digest.slice(8,12)}-4${digest.slice(13,16)}-a${digest.slice(17,20)}-${digest.slice(20,32)}`;
  const [existing]=await query<Entry>("SELECT * FROM studio_entries WHERE id=$1",[id]);
  if(existing){console.log(`Skipped existing import: ${item.key}`);continue;}
  const data=entryDataSchema.parse(item.data);
  async function image(relative:string){const actual=await localFile(relative);const bytes=await fs.readFile(actual);const media=await uploadMedia(admin,new File([new Uint8Array(bytes)],path.basename(actual)),item.kind==="logo"?"logo":"image",{padding:0,trim:false});if(media.status!=="ready")await processMedia(media.id);return media.id;}
  if(item.media?.mediaId)data.mediaId=await image(item.media.mediaId);
  if(item.media?.coverMediaId)data.coverMediaId=await image(item.media.coverMediaId);
  if(item.media?.gallery){data.gallery=[];for(const relative of item.media.gallery)data.gallery.push(await image(relative));}
  const entry=await saveEntry(admin,{id,kind:item.kind,version:0,data});
  if(item.status==="published")await entryAction(admin,id,entry.version,"publish");
  console.log(`Imported ${item.kind}: ${item.key}`);
}
await pool.end();console.log("Local manifest import complete. Existing imports were preserved.");process.exit(0);
