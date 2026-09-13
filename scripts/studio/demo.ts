import "./env";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
import sharp from "sharp";
import { auth } from "../../lib/studio/auth";
import { query, pool } from "../../lib/studio/db";
import { baseURL, dataDir } from "../../lib/studio/config";
import type { Actor } from "../../lib/studio/access";
import { entryDataSchema, type Kind } from "../../lib/studio/validation";
import { saveEntry, entryAction, type Entry } from "../../lib/studio/entries";
import { uploadMedia, mediaAction, type Media } from "../../lib/studio/media";

const dbURL=new URL(process.env.DATABASE_URL!);
if(process.env.NODE_ENV==="production" || !["localhost","127.0.0.1"].includes(dbURL.hostname) || !["localhost","127.0.0.1"].includes(new URL(baseURL()).hostname) || process.env.CMS_MAIL_MODE!=="local" || !path.resolve(dataDir()).startsWith(path.join(process.cwd(),".local")+path.sep))throw new Error("Demo data is only allowed in this project's local development database with local mail.");
const privateFile=path.join(process.cwd(),".local/demo-accounts.json");
type DemoAccount={id?:string;name:string;email:string;password:string;role:Actor["role"];state:string};
const saved:Record<string,DemoAccount>=JSON.parse(await fs.readFile(privateFile,"utf8").catch(()=>"{}"));
const saveAccounts=()=>fs.writeFile(privateFile,JSON.stringify(saved,null,2),{mode:0o600});
const actors:Record<string,Actor>={};
const definitions=[
 ["admin","Demo Administrator","admin","active"],
 ["editor","Demo Editor Meera","editor","active"],
 ["editor2","Demo Editor Arjun","editor","active"],
 ["author","Demo Author Kavya","author","active"],
 ["author2","Demo Author Rohan","author","active"],
 ["disabled","Demo Disabled Staff","author","disabled"],
 ["invited","Demo Invited Staff","author","invited"],
] as const;
const lock=await pool.connect();await lock.query("SELECT pg_advisory_lock(934879)");
try{
 for(const [key,name,role,state] of definitions){
  const email=`${key}.demo@nammaoffice.local`;
  const [existing]=await query<Actor>('SELECT id,name,email,role FROM "user" WHERE email=$1',[email]);
  if(existing&&!saved[key])throw new Error(`The address ${email} already exists outside this demo seed. It was not changed.`);
  if(!saved[key]){saved[key]={name,email,password:randomBytes(24).toString("base64url"),role,state};await saveAccounts();}
  let actor=existing;
  if(!actor){
   const created=await auth.api.signUpEmail({body:{name,email,password:saved[key].password}});
   await query('UPDATE "user" SET role=$2,disabled=$3,"emailVerified"=$4 WHERE id=$1',[created.user.id,role,state==="disabled",state!=="invited"]);
   actor={id:created.user.id,name,email,role};
  }
  saved[key].id=actor.id;actors[key]=actor;await saveAccounts();
  if(state==="invited"){
   const [sent]=await query("SELECT key FROM studio_meta WHERE key='demo-invitation'");
   if(!sent){await auth.api.requestPasswordReset({body:{email,redirectTo:`${baseURL()}/admin/reset-password`}});await query("INSERT INTO studio_meta(key,value) VALUES('demo-invitation','true') ON CONFLICT DO NOTHING");}
  }
 }
 function stableID(key:string){const h=createHash("sha256").update(`nammaoffice-local-demo-v1:${key}`).digest("hex");return`${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`;}
 async function artwork(actor:Actor,label:string,color:string,purpose:"logo"|"image"){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${purpose==="logo"?400:720}" viewBox="0 0 1200 ${purpose==="logo"?400:720}"><rect width="1200" height="900" fill="${color}"/><circle cx="1060" cy="100" r="260" fill="#ffffff" opacity="0.1"/><rect x="70" y="70" width="100" height="100" rx="20" fill="#ffffff" opacity="0.85"/><text x="70" y="${purpose==="logo"?265:430}" fill="#ffffff" font-size="58" font-family="sans-serif" font-weight="bold">${label}</text><text x="70" y="${purpose==="logo"?325:510}" fill="#ffffff" font-size="25" font-family="sans-serif">DEMO ARTWORK — LOCAL REVIEW ONLY</text></svg>`;
  const bytes=await sharp(Buffer.from(svg)).png().toBuffer();
  const m=await uploadMedia(actor,new File([new Uint8Array(bytes)],`demo-${label.toLowerCase().replaceAll(" ","-")}.png`,{type:"image/png"}),purpose,{padding:0,trim:false});
  if(m.status==="ready")return m.id;
  for(let i=0;i<90;i++){const [ready]=await query<Media>("SELECT * FROM studio_media WHERE id=$1",[m.id]);if(ready.status==="ready")return ready.id;if(ready.status==="failed")throw new Error(ready.error||"Demo artwork processing failed.");await new Promise(resolve=>setTimeout(resolve,500));}
  throw new Error("Start npm run cms:dev so the background worker can prepare demo artwork, then rerun this seed.");
 }
 const colors=["#345b64","#965337","#526542","#65567e","#375a86"];
 const covers:Record<string,string>={};
 for(const [key,label,color] of [["author","Workday stories",colors[0]],["author2","People and places",colors[1]],["editor","Community news",colors[2]],["editor2","Project snapshots",colors[3]]] as const)covers[key]=await artwork(actors[key],label,color,"image");
 const states=["draft","review","published","live-draft","scheduled","live-scheduled","archived","trash","restored","published-two","published-three"];
 const themes=["A quieter start to the workday","Designing a focused team routine","Making room for collaboration","A flexible approach to team growth","Community learning calendar","A workspace story in progress","Lessons from a pilot programme","An idea kept for later","A story brought back for review","Better meetings with clear outcomes","A practical workspace checklist"];
 const companies=["Harbour Demo Studio","Willow Demo Labs","Cedar Demo Works","Juniper Demo Team","River Demo Collective","Maple Demo Group","Aster Demo Design","Orchard Demo Office","Summit Demo Partners","Coral Demo Research","Linden Demo Systems"];
 const scheduledAt=new Date(Date.now()+30*86400000);scheduledAt.setUTCHours(4,30,0,0);
 const catalog:{id:string;kind:Kind;scenario:string;owner:string;adminURL:string}[]=[];
 let added=0,skipped=0;
 for(const kind of ["logo","blog","news","case-study","testimonial"] as Kind[]){
  for(const [index,state] of states.entries()){
   const id=stableID(`${kind}:${state}`);const ownerKey=["logo","testimonial"].includes(kind)?"editor":index%2?"author2":"author";const owner=actors[ownerKey];
   catalog.push({id,kind,scenario:state,owner:owner.email,adminURL:`${baseURL()}/admin/${kind==="logo"?"logos":kind==="blog"?"blogs":kind==="case-study"?"case-studies":kind==="testimonial"?"testimonials":"news"}?edit=${id}`});
   const [existing]=await query<Entry>("SELECT * FROM studio_entries WHERE id=$1",[id]);if(existing){skipped++;continue;}
   const label=`DEMO: ${themes[index]} (${state})`;
   const body={type:"doc",content:[{type:"paragraph",content:[{type:"text",text:"DEMO CONTENT: This fictional example is for local CMS review. It is not a claim about an actual client, event or project.",marks:[{type:"bold"}]}]},{type:"heading",attrs:{level:2},content:[{type:"text",text:"The starting point"}]},{type:"paragraph",content:[{type:"text",text:"A small team wants a predictable workday, practical meeting spaces and time to exchange ideas. This sample explains how an editorial story can combine context, a useful takeaway and a clear next step."}]},{type:"heading",attrs:{level:2},content:[{type:"text",text:"What the team explored"}]},{type:"bulletList",content:["Plan focused work before the first meeting.","Choose a shared space that suits the task.","Review what worked at the end of the week."].map(text=>({type:"listItem",content:[{type:"paragraph",content:[{type:"text",text}]}]}))},{type:"blockquote",content:[{type:"paragraph",content:[{type:"text",text:"Demo editorial note: replace this sample with an approved real story before publishing on production."}]}]}]};
   const data=entryDataSchema.parse({title:label,slug:`demo-${kind}-${state}`,excerpt:"Fictional local demo: explore how teams can organise a productive day and how this story moves through the editorial workflow.",body,date:new Date().toISOString().slice(0,10),category:kind==="news"?"Community":"Workplace ideas",authorName:owner.name,coverMediaId:["logo","testimonial"].includes(kind)?"":covers[ownerKey],coverAlt:"Demo illustration for a fictional workspace story",seoTitle:`Demo ${kind}: ${themes[index]}`.slice(0,70),seoDescription:"Local CMS sample content for testing drafts, editorial review and publishing. This is a fictional demonstration.",client:companies[index],industry:"Demo creative services",centre:"Demo workspace",challenge:"Fictional scenario: a growing team needed a shared place to focus and collaborate while keeping its weekly routine flexible.",solution:"Fictional solution: the team trialled a mix of focused desk time, scheduled meeting sessions and a regular feedback check-in.",results:"Fictional outcome: the team identified a clearer routine and a shortlist of workspace needs. These are illustrative statements, not measured client results.",metrics:[{value:"Example",label:"Illustrative outcome only"},{value:"4 weeks",label:"Fictional pilot duration"}],gallery:kind==="case-study"?[covers[ownerKey]]:[],name:kind==="logo"?`DEMO: ${companies[index]} (${state})`:`Demo Person ${index+1} (${state})`,alt:`Demo artwork for ${companies[index]}`,order:100+index,quote:`DEMO TESTIMONIAL — fictional sample for local review: “The team found a useful rhythm between focused work and collaborative sessions.” Scenario: ${state}.`,role:"Fictional team lead",company:companies[index]});
   if(kind==="logo")data.mediaId=await artwork(owner,companies[index],colors[index%colors.length],"logo");
   let entry=await saveEntry(owner,{id,kind,version:0,data});
   const act=async(action:string,extra:{scheduledAt?:string}={})=>{entry=await entryAction(actors.editor,entry.id,entry.version,action,extra);};
   if(state==="review")entry=await entryAction(owner,id,entry.version,"review");
   if(["published","published-two","published-three","live-draft","live-scheduled","archived","trash","restored"].includes(state))await act("publish");
   if(["live-draft","live-scheduled"].includes(state))entry=await saveEntry(owner,{id,kind,version:entry.version,data:{...data,title:label+" — unpublished edit",name:data.name+" — unpublished edit",quote:data.quote+" This last sentence is an unpublished change."}});
   if(["scheduled","live-scheduled"].includes(state))await act("schedule",{scheduledAt:scheduledAt.toISOString()});
   if(state==="archived")await act("archive");
   if(["trash","restored"].includes(state))await act("trash");
   if(state==="restored")await act("restore-trash");
   added++;
  }
 }
 const [extraMedia]=await query("SELECT key FROM studio_meta WHERE key='local-demo-extra-media'");
 if(!extraMedia){
  const readyId=await artwork(actors.editor,"Unused demo artwork",colors[0],"image");
  const trashId=await artwork(actors.editor,"Trashed demo artwork",colors[1],"image");
  const failedId=await artwork(actors.editor,"Retry demo artwork",colors[3],"image");
  const [trashMedia]=await query<Media>("SELECT * FROM studio_media WHERE id=$1",[trashId]);
  if(trashMedia.status!=="trashed")await mediaAction(actors.editor,trashId,trashMedia.version,"trash");
  await query("UPDATE studio_media SET status='failed',error='DEMO: simulated processing interruption. Use Retry to process the preserved original.',version=version+1 WHERE id=$1",[failedId]);
  await query("INSERT INTO studio_meta(key,value) VALUES('local-demo-extra-media',$1)",[JSON.stringify({readyId,trashId,failedId})]);
 }
 await fs.writeFile(".local/demo-content.json",JSON.stringify({createdAt:new Date().toISOString(),scheduledAt:scheduledAt.toISOString(),entries:catalog},null,2),{mode:0o600});
 await query("INSERT INTO studio_meta(key,value) VALUES('local-demo-seed',$1) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value",[JSON.stringify({version:1,entries:catalog.length,at:new Date().toISOString()})]);
 console.log(`Demo seed complete: ${added} entries added, ${skipped} existing demo entries preserved; ${definitions.length} staff accounts available. Credentials: .local/demo-accounts.json. Content guide: .local/demo-content.json. No external email was sent.`);
}finally{await lock.query("SELECT pg_advisory_unlock(934879)");lock.release();await pool.end();}
