import "./env";
import { spawnSync } from "node:child_process";
import { promises as fs } from "node:fs";
const result=spawnSync(process.execPath,["node_modules/next/dist/bin/next","build"],{env:{...process.env,NODE_ENV:"production"},stdio:"inherit"});
if(result.status)process.exit(result.status);
// Next's standalone server needs separately served static files. Keep local
// verification identical to the eventual container layout.
await fs.cp("public",".next/standalone/public",{recursive:true});
await fs.cp(".next/static",".next/standalone/.next/static",{recursive:true});
for(const name of await fs.readdir(".next/standalone"))if(name.startsWith(".env"))await fs.rm(`.next/standalone/${name}`);
