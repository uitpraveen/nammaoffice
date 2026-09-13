import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import sharp from "sharp";
// Explicitly targets this local-only verification project, never a VPS.
const project=["compose","--env-file",".local/docker-check.env","-p","nammaoffice-local-check"];
const docker=(args:string[])=>execFileSync("docker",[...project,...args],{encoding:"utf8",stdio:["ignore","pipe","pipe"]});
const base="http://127.0.0.1:3014";const jar=new Map<string,string>();let checks=0;
const eq=(actual:unknown,expected:unknown,message:string)=>{assert.equal(actual,expected,message);checks++;};
async function call(route:string,method="GET",body?:unknown,authenticated=true){const r=await fetch(base+route,{method,headers:{origin:base,connection:"close",...(authenticated?{cookie:[...jar].map(([k,v])=>`${k}=${v}`).join("; ")}:{}) ,...(body instanceof FormData?{}:{"content-type":"application/json"})},body:body===undefined?undefined:body instanceof FormData?body:JSON.stringify(body),redirect:"manual"});for(const c of r.headers.getSetCookie()){const part=c.split(";")[0],i=part.indexOf("=");jar.set(part.slice(0,i),part.slice(i+1));}const t=await r.text();let data;try{data=JSON.parse(t);}catch{data=t;}return{status:r.status,data};}
async function ready(){for(let i=0;i<60;i++){try{if((await call("/api/health")).status===200)return;}catch{}await new Promise(r=>setTimeout(r,500));}throw new Error("Container did not become ready.");}
await ready();
const credentials=JSON.parse(docker(["exec","-T","web","cat","/data/initial-admin.json"]));
const login=await call("/api/auth/sign-in/email","POST",{email:credentials.email,password:credentials.password});eq(login.status,200,"Container login");eq((await call("/api/studio/users")).status,200,"Container admin needs no second-factor enrollment");
const name=`Container recovery ${Date.now()}`;
try {
 docker(["stop","worker"]);
 const bytes=await sharp({create:{width:600,height:180,channels:4,background:`#${randomUUID().slice(0,6)}`}}).png().toBuffer();const form=new FormData();form.set("file",new File([new Uint8Array(bytes)],`${name}.png`,{type:"image/png"}));form.set("purpose","logo");form.set("options",JSON.stringify({padding:0,trim:false}));
 const upload=await call("/api/studio/media","POST",form);eq(upload.status,202,"Upload accepted while worker stopped");await new Promise(r=>setTimeout(r,1500));eq((await call(`/api/studio/media/${upload.data.id}`)).data.status,"queued","Job remains durable while worker unavailable");
 docker(["start","worker"]);let media;
 for(let i=0;i<80;i++){media=(await call(`/api/studio/media/${upload.data.id}`)).data;if(media.status==="ready")break;if(media.status==="failed")throw new Error(media.error);await new Promise(r=>setTimeout(r,500));}
 eq(media.status,"ready","Restarted worker recovers the pending upload");
 const saved=await call("/api/studio/entries","POST",{id:randomUUID(),kind:"logo",version:0,data:{name,alt:name,mediaId:media.id,order:0}});eq(saved.status,200,"Save logo inside container");
 eq((await call(`/api/studio/entries/${saved.data.id}`,"PATCH",{version:saved.data.version,action:"publish"})).status,200,"Publish inside container");eq((await call(`/media/${media.id}/display`,"GET",undefined,false)).status,200,"Persistent volume image is public");
 eq((await call(`/api/studio/media/${media.id}`,"PATCH",{version:media.version,action:"trash"})).status,409,"Published artwork cannot be removed");
 docker(["restart","web"]);await ready();assert(String((await call("/","GET",undefined,false)).data).includes(name));checks++;eq((await call(`/media/${media.id}/display`,"GET",undefined,false)).status,200,"Artwork persists through web restart");
 await fs.writeFile(".local/container-verification.json",JSON.stringify({passed:true,checks,at:new Date().toISOString()},null,2));console.log(`PASS: ${checks} Linux container checks, including worker recovery and persistent content after restart.`);
}finally{docker(["start","worker"]);}
