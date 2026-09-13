import { requirePage,editorOnly } from "@/lib/studio/access";
import { Shell } from "@/components/studio/Shell";
import { EntryList,EntryEditor } from "@/components/studio/EntryManager";
import { getEntry } from "@/lib/studio/entries";
import { uuid } from "@/lib/studio/validation";
import { notFound,redirect } from "next/navigation";
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{edit?:string;new?:string}>}){
 const actor=await requirePage();if(["logo","testimonial"].includes("testimonial")){try{editorOnly(actor);}catch{redirect("/admin");}}
 const p=await searchParams;let entry=null;if(p.edit){if(!uuid.safeParse(p.edit).success)notFound();try{entry=await getEntry(actor,p.edit);}catch{notFound();}if(entry.kind!=="testimonial")notFound();}
 return <Shell actor={actor}>{p.edit||p.new?<EntryEditor kind="testimonial" initial={entry} actor={actor} key={p.edit||"new"}/>:<EntryList kind="testimonial" actor={actor}/>}</Shell>;
}
