import { ContentArticle,articleMetadata } from "@/components/studio/PublicContent";
export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){return articleMetadata("case-study",(await params).slug);}
export default async function Page({params}:Props){return <ContentArticle kind="case-study" slug={(await params).slug}/>;}
