import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import sharp from "sharp";
import { DOMParser, XMLSerializer } from "@xmldom/xmldom";
import { z } from "zod";
import { query, transaction } from "./db";
import { dataDir } from "./config";
import { StudioError, type Actor } from "./access";
import { audit } from "./entries";
export const uploadOptions = z.object({
  processingVersion: z.literal(2).default(2),
  padding: z.number().int().min(0).max(30).default(8),
  trim: z.boolean().default(false),
  crop: z.object({x:z.number().min(0).max(1),y:z.number().min(0).max(1),width:z.number().positive().max(1),height:z.number().positive().max(1)}).refine(v=>v.x+v.width<=1.00001&&v.y+v.height<=1.00001,"Crop must stay inside the image.").optional(),
}).strict();
export type Media = {id:string;owner_id:string|null;filename:string;mime:string;bytes:string;sha256:string;purpose:"logo"|"image";options:z.infer<typeof uploadOptions>;status:string;variants:Record<string,{width:number;height:number;bytes:number}>;error:string|null;version:number;deleted_at:string|null;created_at:string;updated_at:string};
export const mediaPath=(id:string,variant:string)=>path.join(dataDir(),"media",id,variant==="original"?"original.bin":`${variant}.webp`);
function safeSvg(bytes:Buffer){
  const raw=bytes.toString("utf8");
  if(/<!DOCTYPE|<!ENTITY/i.test(raw))throw new StudioError("SVG external definitions are not supported. Export a plain SVG or PNG.",422);
  const doc=new DOMParser({onError:()=>{throw new Error("Invalid SVG XML");}}).parseFromString(raw,"image/svg+xml");
  const tags=new Set(["svg","g","path","rect","circle","ellipse","line","polyline","polygon","text","tspan","defs","linearGradient","radialGradient","stop","clipPath","mask","use","symbol","title","desc"]);
  const attrs=new Set(["xmlns","xmlns:xlink","id","x","y","x1","x2","y1","y2","width","height","viewBox","preserveAspectRatio","d","points","r","rx","ry","cx","cy","fill","fill-rule","fill-opacity","stroke","stroke-width","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-dasharray","stroke-dashoffset","stroke-opacity","opacity","transform","gradientTransform","gradientUnits","offset","stop-color","stop-opacity","clip-path","clipPathUnits","mask","maskUnits","font-family","font-size","font-weight","text-anchor","dominant-baseline","dx","dy","href","xlink:href"]);
  if(!doc.documentElement||doc.documentElement.tagName!=="svg")throw new StudioError("Invalid SVG.",422);
  function walk(node:Element){
    if(!tags.has(node.tagName))throw new StudioError("This SVG contains unsupported active content or styles. Export a plain SVG or PNG.",422);
    for(let i=node.attributes.length-1;i>=0;i--){const a=node.attributes.item(i)!;
      if(!attrs.has(a.name))throw new StudioError(`Unsupported SVG attribute: ${a.name}. Export a plain SVG or PNG.`,422);
      if((a.name==="href"||a.name==="xlink:href")&&!/^#[\w-]+$/.test(a.value))throw new StudioError("SVG external images and links are not allowed.",422);
      if(/url\s*\(/i.test(a.value)&&!/^url\(\s*#[\w-]+\s*\)$/.test(a.value))throw new StudioError("SVG external resources are not allowed.",422);
    }
    for(let i=0;i<node.childNodes.length;i++){const child=node.childNodes.item(i)!;if(child.nodeType===1)walk(child as unknown as Element);else if(![3,8].includes(child.nodeType))throw new StudioError("Unsupported SVG content.",422);}
  }
  walk(doc.documentElement as unknown as Element);
  return Buffer.from(new XMLSerializer().serializeToString(doc));
}
export async function decodedImage(bytes:Buffer){
  let safe=bytes;
  try {
    if(bytes.toString("utf8",0,256).replace(/^\uFEFF/, "").trimStart().startsWith("<"))safe=safeSvg(bytes);
    const metadata=await sharp(safe,{limitInputPixels:24000000}).metadata();
    if(metadata.pages && metadata.pages>1)throw new StudioError("Choose a still image, not an animation.",422);
    if(!["png","jpeg","webp","svg"].includes(metadata.format||""))throw new StudioError("Use PNG, JPG, WebP or plain SVG.",422);
    if(metadata.format==="svg")safe=safeSvg(bytes);
    if(!metadata.width||!metadata.height||metadata.width*metadata.height>24000000)throw new StudioError("Use an image under 24 megapixels.",422);
    // Force decoding now, before a queued item can be accepted as valid artwork.
    await sharp(safe,{limitInputPixels:24000000}).resize(16,16,{fit:"inside"}).toBuffer();
    return {safe,mime:metadata.format==="svg"?"image/svg+xml":`image/${metadata.format}`};
  }catch(error){if(error instanceof StudioError)throw error;throw new StudioError("This image could not be read. Export a valid PNG, JPG, WebP or plain SVG.",422);}
}
export async function uploadMedia(actor:Actor,file:File,purpose:"logo"|"image",input:unknown){
  if(!file.size||file.size>10*1024*1024)throw new StudioError("Choose an image between 1 byte and 10 MB.",413);
  const options=uploadOptions.parse(input);const bytes=Buffer.from(await file.arrayBuffer());const {mime}=await decodedImage(bytes);
  const hash=createHash("sha256").update(bytes).digest("hex");
  const values=[actor.id,hash,purpose,JSON.stringify(options)];
  const [existing]=await query<Media>("SELECT * FROM studio_media WHERE owner_id=$1 AND sha256=$2 AND purpose=$3 AND options=$4::jsonb",values);
  if(existing){if(existing.status==="trashed")throw new StudioError("This artwork is in trash. Restore it from the media library.",409);return existing;}
  const id=randomUUID();const dir=path.dirname(mediaPath(id,"original"));await fs.mkdir(dir,{recursive:true,mode:0o700});await fs.writeFile(mediaPath(id,"original"),bytes,{mode:0o600});
  try{return await transaction(async db=>{
    const {rows:[media]}=await db.query<Media>("INSERT INTO studio_media(id,owner_id,filename,mime,bytes,sha256,purpose,options) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",[id,actor.id,path.basename(file.name).slice(0,180),mime,bytes.length,hash,purpose,JSON.stringify(options)]);
    await audit(db,actor,"media.upload",id,{filename:media.filename,bytes:file.size});return media;
  });}catch(error){await fs.rm(dir,{recursive:true,force:true});if((error as {code?:string}).code==="23505"){const [same]=await query<Media>("SELECT * FROM studio_media WHERE owner_id=$1 AND sha256=$2 AND purpose=$3 AND options=$4::jsonb",values);if(same)return same;}throw error;}
}
export async function processMedia(id:string){
  const [media]=await query<Media>("UPDATE studio_media SET status='processing',error=NULL,updated_at=now() WHERE id=$1 AND status IN ('queued','processing','failed') RETURNING *",[id]);if(!media)return;
  try{
    const original=await fs.readFile(mediaPath(id,"original"));const {safe}=await decodedImage(original);const opts=media.options;
    let source=await sharp(safe,{limitInputPixels:24000000}).rotate().png().toBuffer();
    if(opts.crop){const m=await sharp(source).metadata();const left=Math.floor(opts.crop.x*m.width!),top=Math.floor(opts.crop.y*m.height!);source=await sharp(source).extract({left,top,width:Math.min(m.width!-left,Math.max(1,Math.floor(opts.crop.width*m.width!))),height:Math.min(m.height!-top,Math.max(1,Math.floor(opts.crop.height*m.height!)))}).png().toBuffer();}
    if(opts.trim)source=await sharp(source).trim({threshold:5}).png().toBuffer();
    const variants:Media["variants"]={};
    for(const [name,width] of [["thumb",320],["display",media.purpose==="logo"?1200:1600]] as const){
      let pipeline=sharp(source).resize({width,height:media.purpose==="logo"?560:1600,fit:"inside",withoutEnlargement:true});
      if(media.purpose==="logo"&&opts.padding){const sourceSize=await sharp(source).metadata();const scaledWidth=Math.min(sourceSize.width!,width,560*sourceSize.width!/sourceSize.height!);const px=Math.round(scaledWidth*opts.padding/100);pipeline=pipeline.extend({top:px,bottom:px,left:px,right:px,background:{r:0,g:0,b:0,alpha:0}});}
      const output=await pipeline.webp({quality:media.purpose==="logo"?92:82,effort:4}).toBuffer({resolveWithObject:true});
      const destination=mediaPath(id,name);const temp=`${destination}.${randomUUID()}.tmp`;await fs.writeFile(temp,output.data,{mode:0o600});await fs.rename(temp,destination);
      variants[name]={width:output.info.width,height:output.info.height,bytes:output.info.size};
    }
    await query("UPDATE studio_media SET status='ready',variants=$2,error=NULL,version=version+1,updated_at=now() WHERE id=$1 AND status='processing'",[id,JSON.stringify(variants)]);
  }catch(error){await query("UPDATE studio_media SET status='failed',error=$2,updated_at=now() WHERE id=$1 AND status='processing'",[id,error instanceof StudioError?error.message:"Processing failed. Retry from the media library."]);throw error;}
}
export async function listMedia(actor:Actor,page=1,search="",trash=false){const items=await query<Media & {total:string}>("SELECT *,count(*) OVER() AS total FROM studio_media WHERE ($1::text IS NULL OR owner_id=$1) AND filename ILIKE $2 AND (status='trashed')=$3 ORDER BY created_at DESC LIMIT 24 OFFSET $4",[actor.role==="author"?actor.id:null,`%${search}%`,trash,(page-1)*24]);return{items,total:Number(items[0]?.total??0),page};}
export async function mediaAction(actor:Actor,id:string,version:number,action:string){return transaction(async db=>{
  const {rows:[m]}=await db.query<Media>("SELECT * FROM studio_media WHERE id=$1 FOR UPDATE",[id]);if(!m)throw new StudioError("Image not found.",404);if(actor.role==="author"&&m.owner_id!==actor.id)throw new StudioError("You cannot change this image.",403);if(m.version!==version)throw new StudioError("This image changed. Reload the library.",409);
  if(action==="trash"){
    const {rowCount}=await db.query("SELECT 1 WHERE EXISTS(SELECT 1 FROM studio_media_usage WHERE media_id=$1) OR EXISTS(SELECT 1 FROM studio_revisions WHERE data->>'mediaId'=$1::text OR data->>'coverMediaId'=$1::text OR data->>'mobileMediaId'=$1::text OR data->'gallery' @> jsonb_build_array($1::text))",[id]);if(rowCount)throw new StudioError("This image is retained by content or revision history. Archive the content to remove it from the website; its artwork stays available for recovery.",409);
    if(["queued","processing"].includes(m.status))throw new StudioError("Wait for processing to finish.",409);
    await db.query("UPDATE studio_media SET status='trashed',deleted_at=now(),version=version+1 WHERE id=$1",[id]);
  }else if(action==="restore"){if(m.status!=="trashed")throw new StudioError("This image is not in trash.",409);await db.query("UPDATE studio_media SET status=CASE WHEN variants ? 'display' THEN 'ready' ELSE 'queued' END,deleted_at=NULL,version=version+1 WHERE id=$1",[id]);}
  else if(action==="retry"){if(m.status!=="failed")throw new StudioError("Only failed images can be retried.",409);await db.query("UPDATE studio_media SET status='queued',error=NULL,version=version+1,updated_at=now() WHERE id=$1",[id]);}
  else throw new StudioError("Unknown media action.");await audit(db,actor,`media.${action}`,id);return(await db.query<Media>("SELECT * FROM studio_media WHERE id=$1",[id])).rows[0];
});}
