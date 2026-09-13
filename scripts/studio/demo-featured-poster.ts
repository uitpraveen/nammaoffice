import "./env";
import {promises as fs} from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {pool,query} from "../../lib/studio/db";
import {baseURL,dataDir} from "../../lib/studio/config";
import type {Actor} from "../../lib/studio/access";
import {uploadMedia,type Media} from "../../lib/studio/media";
import {saveEntry,entryAction} from "../../lib/studio/entries";
import {entryDataSchema} from "../../lib/studio/validation";
const db=new URL(process.env.DATABASE_URL!);
if(process.env.NODE_ENV==="production"||db.hostname!=="127.0.0.1"||new URL(baseURL()).hostname!=="127.0.0.1"||process.env.CMS_MAIL_MODE!=="local"||!path.resolve(dataDir()).startsWith(path.join(process.cwd(),".local")+path.sep))throw new Error("This sample is for local review only.");
const id="7bcd21f8-1d3f-4a6f-8b21-91c5a8d147b2";
try{
 if((await query("SELECT id FROM studio_entries WHERE id=$1",[id])).length){console.log("Preserved the existing large-poster sample.");process.exitCode=0;}
 else{
  const [editor]=await query<Actor>('SELECT id,name,email,role FROM "user" WHERE email=\'editor.demo@nammaoffice.local\' AND disabled=false');if(!editor)throw new Error("Create demo staff first.");
  async function image(mobile:boolean){
   const width=mobile?900:1600,height=mobile?1200:900;
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f4eddc"/><circle cx="${mobile?830:1430}" cy="${mobile?650:420}" r="${mobile?290:510}" fill="#d3a45c"/><circle cx="${mobile?830:1430}" cy="${mobile?650:420}" r="${mobile?185:355}" fill="#f4eddc"/><rect x="0" y="0" width="${width}" height="100" fill="#223e36"/><text x="60" y="65" font-family="sans-serif" font-size="33" font-weight="bold" letter-spacing="-1" fill="#f4eddc">nammaoffice.</text><text x="${mobile?610:1270}" y="62" font-family="sans-serif" font-size="20" letter-spacing="2" fill="#e7c27f">LOCAL DEMO</text><rect x="60" y="165" width="340" height="48" rx="24" fill="#a45336"/><text x="88" y="197" font-family="sans-serif" font-size="20" letter-spacing="2" fill="#fff">COMMUNITY OPEN HOUSE</text><g font-family="sans-serif" font-size="${mobile?115:150}" font-weight="bold" fill="#223e36" letter-spacing="-6"><text x="55" y="${mobile?375:405}">GOOD SPACE.</text><text x="55" y="${mobile?515:565}">GREAT IDEAS.</text></g><text x="60" y="${mobile?670:665}" font-family="sans-serif" font-size="${mobile?29:35}" fill="#41554a">Meet the people. Explore the workspace.</text><text x="60" y="${mobile?720:715}" font-family="sans-serif" font-size="${mobile?29:35}" fill="#41554a">Make your next connection.</text><path d="M${mobile?60:1300} ${mobile?800:620}h${mobile?225:160}v${mobile?140:100}h-${mobile?225:160}z" fill="#223e36"/><path d="M${mobile?285:1460} ${mobile?820:635}h30c75 0 75 95 0 95h-30" fill="none" stroke="#223e36" stroke-width="18"/><rect x="0" y="${height-85}" width="${width}" height="85" fill="#223e36"/><text x="60" y="${height-32}" font-family="sans-serif" font-size="${mobile?21:24}" letter-spacing="2" fill="#f4eddc">SAMPLE ARTWORK · NOT A REAL EVENT</text></svg>`;
   const bytes=await sharp(Buffer.from(svg)).png().toBuffer();const media=await uploadMedia(editor,new File([new Uint8Array(bytes)],mobile?"open-house-mobile-demo.png":"open-house-wide-demo.png",{type:"image/png"}),"image",{padding:0,trim:false});
   for(let i=0;i<90;i++){const [m]=await query<Media>("SELECT * FROM studio_media WHERE id=$1",[media.id]);if(m.status==="ready")return m.id;if(m.status==="failed")throw new Error(m.error||"Image failed");await new Promise(r=>setTimeout(r,500));}throw new Error("Start the local worker before adding this sample.");
  }
  const coverMediaId=await image(false),mobileMediaId=await image(true);
  const entry=await saveEntry(editor,{id,kind:"promotion",version:0,data:entryDataSchema.parse({title:"DEMO: Community open house — image-only hero",imageOnly:true,coverMediaId,mobileMediaId,coverAlt:"NammaOffice community open house sample: good space, great ideas. Meet people, explore the workspace and make connections. This is demonstration artwork, not a real event.",endsAt:new Date(Date.now()+7*86400000).toISOString(),priority:200})});
  await entryAction(editor,id,entry.version,"publish");await fs.writeFile(".local/demo-featured-poster.json",JSON.stringify({id,url:baseURL()+"/admin/promotions?edit="+id,priority:200},null,2),{mode:0o600});console.log("Added one image-only hero sample with desktop and mobile artwork. Existing content was preserved.");
 }
}finally{await pool.end();}
