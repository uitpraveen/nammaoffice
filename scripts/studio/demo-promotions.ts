import "./env";
import { promises as fs } from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
import sharp from "sharp";
import {pool,query} from "../../lib/studio/db";
import {baseURL,dataDir} from "../../lib/studio/config";
import type {Actor} from "../../lib/studio/access";
import {uploadMedia,type Media} from "../../lib/studio/media";
import {saveEntry,entryAction,type Entry} from "../../lib/studio/entries";
import {entryDataSchema} from "../../lib/studio/validation";
const db=new URL(process.env.DATABASE_URL!);
if(process.env.NODE_ENV==="production"||!["localhost","127.0.0.1"].includes(db.hostname)||!["localhost","127.0.0.1"].includes(new URL(baseURL()).hostname)||process.env.CMS_MAIL_MODE!=="local"||!path.resolve(dataDir()).startsWith(path.join(process.cwd(),".local")+path.sep))throw new Error("Demo promotions only run in this project's local development environment.");
const [editor]=await query<Actor>('SELECT id,name,email,role FROM "user" WHERE email=\'editor.demo@nammaoffice.local\' AND role=\'editor\' AND disabled=false');if(!editor)throw new Error("Load the demo staff accounts first.");
async function poster(mobile:boolean){
 const width=mobile?900:1200,height=mobile?1200:1500;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 900 1200"><rect width="900" height="1200" fill="#f6eddc"/><rect x="0" y="0" width="900" height="80" fill="#263e37"/><text x="55" y="51" font-family="sans-serif" font-size="25" letter-spacing="3" fill="#fff">NAMMAOFFICE · LOCAL DEMO</text><circle cx="780" cy="430" r="285" fill="#d7a653" opacity=".6"/><circle cx="780" cy="430" r="190" fill="#f6eddc"/><rect x="55" y="138" width="320" height="50" rx="25" fill="#a65339"/><text x="82" y="172" font-family="sans-serif" font-size="22" fill="white">COMMUNITY GATHERING</text><g fill="#263e37" font-family="sans-serif" font-size="103" font-weight="bold"><text x="50" y="330">FOUNDERS</text><text x="50" y="453">COFFEE</text><text x="50" y="576">MORNING</text></g><path d="M75 685h310v95c0 95-310 95-310 0z" fill="#263e37"/><path d="M385 700h40c85 0 80 105-40 105" stroke="#263e37" stroke-width="25" fill="none"/><path d="M150 655c-35-45 30-60 0-105M230 655c-35-45 30-60 0-105" stroke="#a65339" stroke-width="9" fill="none"/><text x="55" y="955" font-family="sans-serif" font-size="35" fill="#263e37">Meet. Share ideas. Make connections.</text><text x="55" y="1020" font-family="sans-serif" font-size="27" fill="#536059">A sample event for reviewing the homepage.</text><rect x="0" y="1100" width="900" height="100" fill="#263e37"/><text x="55" y="1162" font-family="sans-serif" font-size="24" fill="#fff">DEMO POSTER — NOT A REAL EVENT</text></svg>`;
 const bytes=await sharp(Buffer.from(svg)).png().toBuffer();const media=await uploadMedia(editor,new File([new Uint8Array(bytes)],mobile?"demo-event-mobile.png":"demo-event-desktop.png",{type:"image/png"}),"image",{padding:0,trim:false});
 for(let i=0;i<90;i++){const [m]=await query<Media>("SELECT * FROM studio_media WHERE id=$1",[media.id]);if(m.status==="ready")return m.id;if(m.status==="failed")throw new Error(m.error||"Poster processing failed");await new Promise(resolve=>setTimeout(resolve,500));}throw new Error("Start the local worker and rerun this seed.");
}
try{
 const coverMediaId=await poster(false),mobileMediaId=await poster(true),future=new Date(Date.now()+7*86400000).toISOString(),end=new Date(Date.now()+14*86400000).toISOString();let added=0;const catalog=[];
 for(const state of ["draft","review","published","live-draft","scheduled","live-scheduled","archived","trash","restored","published-two","published-three","expired"]){
  const h=createHash("sha256").update(`namma-demo-promotion-v1:${state}`).digest("hex"),id=`${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;
  catalog.push({state,id,url:`${baseURL()}/admin/promotions?edit=${id}`});
  if((await query("SELECT id FROM studio_entries WHERE id=$1",[id])).length)continue;
  const data=entryDataSchema.parse({title:`DEMO: Community coffee morning (${state})`,excerpt:"A fictional community event for reviewing the new homepage poster. No event registration is taking place.",coverMediaId,mobileMediaId,coverAlt:"Demo founders coffee morning poster. This is not a real event.",startsAt:state==="expired"?new Date(Date.now()-2*86400000).toISOString():"",endsAt:state==="expired"?new Date(Date.now()-86400000).toISOString():end,priority:state==="published"?100:state==="expired"?1000:10,ctaLabel:"Explore demo news",ctaUrl:baseURL()+"/news"});
  let entry:Entry=await saveEntry(editor,{id,kind:"promotion",version:0,data});
  const action=async(name:string,extra:{scheduledAt?:string}={})=>{entry=await entryAction(editor,id,entry.version,name,extra);};
  if(state==="review")await action("review");
  if(!["draft","review","scheduled"].includes(state))await action("publish");
  if(["live-draft","live-scheduled"].includes(state))entry=await saveEntry(editor,{id,kind:"promotion",version:entry.version,data:{...data,title:data.title+" — unpublished update"}});
  if(["scheduled","live-scheduled"].includes(state))await action("schedule",{scheduledAt:future});
  if(state==="archived")await action("archive");
  if(["trash","restored"].includes(state))await action("trash");
  if(state==="restored")await action("restore-trash");
  added++;
 }
 await fs.writeFile(".local/demo-promotions.json",JSON.stringify(catalog,null,2),{mode:0o600});console.log(`Added ${added} demo hero promotions; preserved ${catalog.length-added} existing entries. Originals and sample poster files are local only.`);
}finally{await pool.end();}
