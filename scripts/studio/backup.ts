import "./env";
import { promises as fs,createReadStream,createWriteStream } from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomBytes,createCipheriv,createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { dataDir } from "../../lib/studio/config";
import { command,pgExecutable,pgEnv,backupKey } from "./backup-common";
const key=backupKey();if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL is required.");
const tmp=await fs.mkdtemp(path.join(os.tmpdir(),"namma-backup-"));await fs.chmod(tmp,0o700);
const outdir=process.env.CMS_BACKUP_DIR||path.join(process.cwd(),".local/backups");await fs.mkdir(outdir,{recursive:true,mode:0o700});
const output=path.join(outdir,`nammaoffice-${new Date().toISOString().replaceAll(":","-")}.nobak`);
async function checksums(dir:string,base=dir):Promise<Record<string,string>>{let result:Record<string,string>={};for(const e of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isSymbolicLink())throw new Error("Backup media must not contain symlinks.");if(e.isDirectory())result={...result,...await checksums(file,base)};else result[path.relative(base,file)]=createHash("sha256").update(await fs.readFile(file)).digest("hex");}return result;}
try{
  await command(pgExecutable("pg_dump"),["--format=custom","--file",path.join(tmp,"database.dump")],pgEnv(process.env.DATABASE_URL));
  await fs.cp(path.join(dataDir(),"media"),path.join(tmp,"media"),{recursive:true,filter:source=>!source.endsWith(".tmp")});
  const sums=await checksums(tmp);await fs.writeFile(path.join(tmp,"manifest.json"),JSON.stringify({version:1,createdAt:new Date().toISOString(),files:sums},null,2));
  const tar=path.join(tmp,"snapshot.tar");await command("tar",["-cf",tar,"-C",tmp,"database.dump","media","manifest.json"]);
  const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key,iv);const temporary=output+".tmp";
  await fs.writeFile(temporary,Buffer.concat([Buffer.from("NOCMS01"),iv]),{mode:0o600});
  await pipeline(createReadStream(tar),cipher,createWriteStream(temporary,{flags:"a",mode:0o600}));await fs.appendFile(temporary,cipher.getAuthTag());await fs.rename(temporary,output);
  console.log(`Encrypted database + media backup created: ${output}`);
}finally{await fs.rm(tmp,{recursive:true,force:true});}
