import "./env";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes,createHash } from "node:crypto";
import { getMigrations } from "better-auth/db/migration";
import { auth } from "../../lib/studio/auth";
import { query,pool } from "../../lib/studio/db";
import { dataDir } from "../../lib/studio/config";
import { entryDataSchema } from "../../lib/studio/validation";
import type { Actor } from "../../lib/studio/access";
import { saveEntry,entryAction } from "../../lib/studio/entries";
import sharp from "sharp";

if(!process.env.DATABASE_URL)throw new Error("Set DATABASE_URL before setup.");
const migration=await getMigrations(auth.options);await migration.runMigrations();
await (await import("../../lib/studio/migrations")).migrateStudio();
await fs.mkdir(dataDir(),{recursive:true,mode:0o700});
let [admin]=await query<Actor>('SELECT id,name,email,role FROM "user" WHERE role=\'admin\' AND disabled=false LIMIT 1');
if(!admin){
  const email=process.env.CMS_BOOTSTRAP_EMAIL||"admin@nammaoffice.local",password=randomBytes(24).toString("base64url");
  const created=await auth.api.signUpEmail({body:{email,password,name:"NammaOffice Administrator"}});
  await query('UPDATE "user" SET role=\'admin\',"emailVerified"=true WHERE id=$1',[created.user.id]);
  admin={id:created.user.id,email,name:created.user.name,role:"admin"};
  await fs.writeFile(path.join(dataDir(),"initial-admin.json"),JSON.stringify({email,password,url:`${process.env.BETTER_AUTH_URL}/admin/login`,note:"Local administrator. Delete this file after storing the password securely."},null,2),{mode:0o600});
  console.log("Created initial administrator. Credentials saved privately in CMS_DATA_DIR/initial-admin.json.");
}
const [seeded]=await query("SELECT key FROM studio_meta WHERE key='repository-seed'");
const [{count}]=await query<{count:string}>("SELECT count(*) FROM studio_entries");
if(process.env.CMS_SEED_SOURCE==="repository" && !seeded){
  if(count!=="0") console.log("Resuming the explicit repository import; existing entries are preserved.");
  const logos=JSON.parse(await fs.readFile("lib/data/clients.json","utf8")) as {name:string;logo:string;w:number;h:number}[];
  for(const [order,logo] of logos.entries()){
    const digest=createHash("sha256").update(`repository-logo:${logo.logo}`).digest("hex");
    const id=`${digest.slice(0,8)}-${digest.slice(8,12)}-4${digest.slice(13,16)}-a${digest.slice(17,20)}-${digest.slice(20,32)}`;
    const entryDigest=createHash("sha256").update(`repository-entry:${logo.logo}`).digest("hex");
    const entryId=`${entryDigest.slice(0,8)}-${entryDigest.slice(8,12)}-4${entryDigest.slice(13,16)}-a${entryDigest.slice(17,20)}-${entryDigest.slice(20,32)}`;
    const [existing]=await query<{id:string;version:number;published_revision:string|null}>("SELECT id,version,published_revision FROM studio_entries WHERE id=$1",[entryId]);
    if(existing){if(!existing.published_revision)await entryAction(admin,existing.id,existing.version,"publish");continue;}
    const dir=path.join(dataDir(),"media",id);await fs.mkdir(dir,{recursive:true,mode:0o700});
    const bytes=await fs.readFile(path.join(process.cwd(),"public",logo.logo));
    await fs.writeFile(path.join(dir,"original.bin"),bytes,{mode:0o600});await fs.writeFile(path.join(dir,"display.webp"),bytes,{mode:0o600});
    const thumb=await sharp(bytes).resize({width:320,height:180,fit:"inside",withoutEnlargement:true}).webp({quality:90}).toBuffer({resolveWithObject:true});await fs.writeFile(path.join(dir,"thumb.webp"),thumb.data,{mode:0o600});
    
    await query("INSERT INTO studio_media(id,owner_id,filename,mime,bytes,sha256,purpose,status,variants,options) VALUES($1,$2,$3,'image/webp',$4,$5,'logo','ready',$6,$7) ON CONFLICT DO NOTHING",[id,admin.id,path.basename(logo.logo),bytes.length,createHash("sha256").update(bytes).digest("hex"),JSON.stringify({display:{width:logo.w,height:logo.h,bytes:bytes.length},thumb:{width:thumb.info.width,height:thumb.info.height,bytes:thumb.info.size}}),JSON.stringify({padding:0,trim:false})]);
    const entry=await saveEntry(admin,{id:entryId,kind:"logo",version:0,data:entryDataSchema.parse({name:logo.name,alt:logo.name,mediaId:id,order})});await entryAction(admin,entry.id,entry.version,"publish");
  }
  await query("INSERT INTO studio_meta(key,value) VALUES('repository-seed',$1)",[JSON.stringify({at:new Date().toISOString(),source:"repository",logos:logos.length})]);console.log(`Imported ${logos.length} repository logos. No live Blob data was accessed.`);
}
await fs.mkdir(path.join(dataDir(),"media"),{recursive:true,mode:0o700});
console.log("Database migration and setup complete.");await pool.end();process.exit(0);
