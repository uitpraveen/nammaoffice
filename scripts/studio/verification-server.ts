import "./env";
import { promises as fs } from "node:fs";
import { spawn } from "node:child_process";
const c=JSON.parse(await fs.readFile(".local/verification.json","utf8"));
for(const key of ["GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","CMS_GOOGLE_WORKSPACE_DOMAIN","CMS_ALLOWED_EMAILS"])delete process.env[key];
const env:NodeJS.ProcessEnv={...process.env,DATABASE_URL:c.databaseURL,CMS_DATA_DIR:c.dataDir,BETTER_AUTH_URL:c.baseURL,CMS_MAIL_MODE:"local",NODE_ENV:"production",PORT:"3012",HOSTNAME:"127.0.0.1"};
const worker=spawn(process.execPath,["--import","tsx","scripts/studio/worker.ts"],{env,stdio:"inherit"});
const app=spawn(process.execPath,[".next/standalone/server.js"],{env,stdio:"inherit"});
let stopping=false;function stop(){if(stopping)return;stopping=true;worker.kill("SIGTERM");app.kill("SIGTERM");}worker.on("exit",stop);app.on("exit",stop);process.on("SIGTERM",stop);process.on("SIGINT",stop);

await fs.writeFile(".local/verification-process.json",JSON.stringify({pid:process.pid,app:app.pid,worker:worker.pid}),{mode:0o600});
