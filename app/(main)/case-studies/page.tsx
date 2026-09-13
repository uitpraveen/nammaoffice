import { ContentIndex } from "@/components/studio/PublicContent";
export const metadata={title:"Case studies",alternates:{canonical:"/case-studies"}};
export const dynamic="force-dynamic";
export default async function Page({searchParams}:{searchParams:Promise<{page?:string}>}){const p=Number((await searchParams).page)||1;return <ContentIndex kind="case-study" page={Math.max(1,Math.min(10000,Math.floor(p)))}/>;}
