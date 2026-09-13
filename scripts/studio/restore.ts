import "./env";
import { promises as fs,createReadStream,createWriteStream } from "node:fs";
import path from "node:path";
import os from "node:os";
import { createDecipheriv,createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Pool } from "pg";
import { command,pgExecutable,pgEnv,backupKey } from "./backup-common";
const input=process.argv[2],target=process.env.CMS_RESTORE_DATABASE_URL,mediaTarget=process.env.CMS_RESTORE_MEDIA_DIR;
if(!input||!target||!mediaTarget)throw new Error("Usage: CMS_RESTORE_DATABASE_URL=... CMS_RESTORE_MEDIA_DIR=... npm run cms:restore -- file.nobak. Target database and media directory must be empty.");
if(new URL(target).href===new URL(process.env.DATABASE_URL!).href)throw new Error("Restore refuses the active CMS database. Use a separate empty recovery database.");
const db=new Pool({connectionString:target});const {rows:[existing]}=await db.query("SELECT count(*) FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog','information_schema')");await db.end();if(Number(existing.count))throw new Error("Restore target database is not empty.");
const files=await fs.readdir(mediaTarget).catch(()=>[]);if(files.length)throw new Error("Restore media directory is not empty.");
const tmp=await fs.mkdtemp(path.join(os.tmpdir(),"namma-restore-"));await fs.chmod(tmp,0o700);
try{
  const stat=await fs.stat(input);const handle=await fs.open(input,"r");const header=Buffer.alloc(19),tag=Buffer.alloc(16);await handle.read(header,0,19,0);await handle.read(tag,0,16,stat.size-16);await handle.close();if(header.subarray(0,7).toString()!=="NOCMS01")throw new Error("Unknown backup format.");
  const decipher=createDecipheriv("aes-256-gcm",backupKey(),header.subarray(7));decipher.setAuthTag(tag);const tar=path.join(tmp,"snapshot.tar");await pipeline(createReadStream(input,{start:19,end:stat.size-17}),decipher,createWriteStream(tar,{mode:0o600}));
  await command("tar",["-xf",tar,"-C",tmp]);
  const manifest=JSON.parse(await fs.readFile(path.join(tmp,"manifest.json"),"utf8"));if(manifest.version!==1)throw new Error("Unsupported snapshot version.");
  for(const [file,hash] of Object.entries(manifest.files)){if(path.isAbsolute(file)||file.split(path.sep).includes(".."))throw new Error("Unsafe backup path.");if(createHash("sha256").update(await fs.readFile(path.join(tmp,file))).digest("hex")!==hash)throw new Error(`Checksum failed: ${file}`);}
  await command(pgExecutable("pg_restore"),["--exit-on-error","--no-owner","--no-privileges","--dbname",new URL(target).pathname.slice(1),path.join(tmp,"database.dump")],pgEnv(target));
  await fs.mkdir(mediaTarget,{recursive:true,mode:0o700});await fs.cp(path.join(tmp,"media"),mediaTarget,{recursive:true});
  console.log("Backup restored into the separate recovery database and media directory. The active application was not changed.");
}finally{await fs.rm(tmp,{recursive:true,force:true});}
