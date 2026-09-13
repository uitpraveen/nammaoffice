import "./env";
import { spawn,spawnSync } from "node:child_process";
import { existsSync,promises as fs } from "node:fs";
import path from "node:path";
import { Pool } from "pg";
const url=new URL(process.env.DATABASE_URL||"postgresql://namma_local@127.0.0.1:55432/nammaoffice_cms");
if(!["127.0.0.1","localhost"].includes(url.hostname))throw new Error("The local launcher only connects to a loopback database.");
const pgBin=process.env.PG_BIN||"/opt/homebrew/opt/postgresql@18/bin";
const db=new Pool({connectionString:url.href,connectionTimeoutMillis:1500});
try{await db.query("SELECT 1");}catch{
  const dir=path.join(process.cwd(),".local/postgres");await fs.mkdir(dir,{recursive:true,mode:0o700});
  if(!existsSync(path.join(pgBin,"pg_ctl")))throw new Error("Install PostgreSQL 18 and set PG_BIN, or use the Docker Compose setup. See docs/vps-cms.md.");
  if(!existsSync(path.join(dir,"PG_VERSION"))){const r=spawnSync(path.join(pgBin,"initdb"),["-D",dir,"-U","namma_local","--auth=trust","--encoding=UTF8"],{stdio:"inherit"});if(r.status)process.exit(r.status);}
  const start=spawnSync(path.join(pgBin,"pg_ctl"),["-D",dir,"-l",path.join(process.cwd(),".local/postgres.log"),"-o",`-h 127.0.0.1 -p ${url.port||55432} -k /tmp`,"start"],{stdio:"inherit"});if(start.status)throw new Error("Could not start the local database.");
  spawnSync(path.join(pgBin,"createdb"),["-h","127.0.0.1","-p",url.port||"55432","-U","namma_local",url.pathname.slice(1)],{stdio:"inherit"});
}finally{await db.end();}
const setup=spawnSync(process.execPath,["--import","tsx","scripts/studio/setup.ts"],{stdio:"inherit",env:{...process.env,CMS_SEED_SOURCE:"repository"}});if(setup.status)process.exit(setup.status);
const port=process.env.CMS_LOCAL_PORT||"3001";
const children=[spawn(process.execPath,["--import","tsx","scripts/studio/worker.ts"],{stdio:"inherit",env:process.env}),spawn(process.execPath,["node_modules/next/dist/bin/next","dev","--hostname","127.0.0.1","--port",port],{stdio:"inherit",env:process.env})];
let stopping=false;function stop(){if(stopping)return;stopping=true;for(const child of children)child.kill("SIGTERM");}
for(const child of children)child.on("exit",()=>stop());process.on("SIGINT",stop);process.on("SIGTERM",stop);
console.log(`Local Studio: http://127.0.0.1:${port}/admin/login`);
