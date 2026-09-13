import { spawn } from "node:child_process";
import path from "node:path";
import { existsSync } from "node:fs";
export function pgExecutable(name:string){const dir=process.env.PG_BIN|| (existsSync("/opt/homebrew/opt/postgresql@18/bin/pg_dump")?"/opt/homebrew/opt/postgresql@18/bin":"");return dir?path.join(dir,name):name;}
export function pgEnv(connection:string){const u=new URL(connection);return {...process.env,PGHOST:u.hostname,PGPORT:u.port||"5432",PGUSER:decodeURIComponent(u.username),PGPASSWORD:decodeURIComponent(u.password),PGDATABASE:decodeURIComponent(u.pathname.slice(1)),PGSSLMODE:u.searchParams.get("sslmode")||"prefer"};}
export function command(bin:string,args:string[],env:NodeJS.ProcessEnv=process.env){return new Promise<void>((resolve,reject)=>{const child=spawn(bin,args,{env,stdio:["ignore","ignore","pipe"]});let error="";child.stderr.on("data",chunk=>{error+=chunk;});child.on("error",reject);child.on("exit",code=>code===0?resolve():reject(new Error(`${path.basename(bin)} failed: ${error.slice(0,1000)}`)));});}
export function backupKey(){const value=process.env.CMS_BACKUP_KEY;if(!value)throw new Error("Set CMS_BACKUP_KEY to a 32-byte base64 key. Keep it off-server too.");const bytes=Buffer.from(value,"base64");if(bytes.length!==32)throw new Error("CMS_BACKUP_KEY must decode to 32 bytes.");return bytes;}
