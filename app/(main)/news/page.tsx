import { ContentIndex } from "@/components/studio/PublicContent";
export const metadata={title:"News",alternates:{canonical:"/news"}};
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{page?:string}>}){const p=Number((await searchParams).page)||1;return <ContentIndex kind="news" page={Math.max(1,Math.min(10000,Math.floor(p)))}/>;}
