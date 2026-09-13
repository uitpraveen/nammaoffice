import "server-only";
import { cache } from "react";
import { publicEntries,mediaURL } from "@/lib/studio/public";
import { query } from "@/lib/studio/db";
import type { RichNode } from "@/lib/studio/validation";
export const CONTENT_TAG="cms-public-content";
function plain(node:RichNode):string{return node.text||node.content?.map(plain).join(" ")||"";}
export const getPublicContent=cache(async()=>{
  const [logos,news,testimonials]=await Promise.all([publicEntries("logo",1000),publicEntries("news",1000),publicEntries("testimonial",1000)]);
  const ids=logos.map(l=>l.data.mediaId);const images=ids.length?await query<{id:string;variants:{display:{width:number;height:number}}}>("SELECT id,variants FROM studio_media WHERE id=ANY($1::uuid[]) AND status='ready'",[ids]):[];
  return {
    clients:logos.flatMap(l=>{const m=images.find(m=>m.id===l.data.mediaId);return m?.variants.display?[{id:l.id,name:l.data.name,website:l.data.website,logo:mediaURL(m.id),w:m.variants.display.width,h:m.variants.display.height}]:[];}),
    news:news.map(n=>({id:n.id,version:n.updated_at,status:"published" as const,title:n.data.title,slug:n.data.slug,date:n.data.date||new Date(n.published_at).toISOString().slice(0,10),category:"News" as const,excerpt:n.data.excerpt,body:(n.data.body.content||[]).map(plain),coverImage:mediaURL(n.data.coverMediaId),coverAlt:n.data.coverAlt,videoUrl:n.data.videoUrl})),
    testimonials:testimonials.map(t=>({id:t.id,version:t.updated_at,status:"published" as const,quote:t.data.quote,name:t.data.name,role:t.data.role,company:t.data.company,centre:t.data.centre,order:t.data.order})),
    updatedAt:[...logos,...news,...testimonials].reduce((latest,e)=>new Date(e.updated_at).toISOString()>latest?new Date(e.updated_at).toISOString():latest,"1970-01-01T00:00:00.000Z"),
  };
});
