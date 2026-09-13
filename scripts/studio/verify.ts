import "./env";
import { spawn, type ChildProcess } from "node:child_process";
import { promises as fs } from "node:fs";
const db=new URL(process.env.DATABASE_URL!);
if(!["127.0.0.1","localhost"].includes(db.hostname))throw new Error("Verification requires local PostgreSQL.");
function run(args:string[]){return new Promise<void>((resolve,reject)=>{const child=spawn(process.execPath,args,{stdio:"inherit",env:process.env});child.on("error",reject);child.on("exit",code=>code===0?resolve():reject(new Error(`Verification command failed (${code}): ${args.join(" ")}`)));});}
let server:ChildProcess|undefined;
try {
  if(!process.argv.includes("--skip-build"))await run(["--import","tsx","scripts/studio/build-local.ts"]);
  await run(["--import","tsx","scripts/studio/verification-setup.ts"]);
  server=spawn(process.execPath,["--import","tsx","scripts/studio/verification-server.ts"],{stdio:"inherit",env:process.env});
  let ready=false;
  for(let i=0;i<120;i++){
    if(server.exitCode!==null)throw new Error("Verification server stopped unexpectedly.");
    try{const response=await fetch("http://127.0.0.1:3012/api/health",{signal:AbortSignal.timeout(1000)});if(response.ok){ready=true;break;}}catch{}
    await new Promise(resolve=>setTimeout(resolve,500));
  }
  if(!ready)throw new Error("Verification server did not become ready.");
  await run(["--import","tsx","scripts/studio/test-http.ts"]);
  await run(["--import","tsx","scripts/studio/test-google.ts"]);
  await run(["node_modules/@playwright/test/cli.js","test"]);
  await fs.writeFile(".local/verification-result.json",JSON.stringify({passed:true,at:new Date().toISOString(),http:JSON.parse(await fs.readFile(".local/http-verification.json","utf8")),browserScenarios:12},null,2));
  console.log("Production-mode HTTP and browser verification passed in the separate test database.");
}finally{
  if(server&&server.exitCode===null){server.kill("SIGTERM");await new Promise(resolve=>server!.once("exit",resolve));}
}
