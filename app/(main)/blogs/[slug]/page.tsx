import { ContentArticle,articleMetadata } from "@/components/studio/PublicContent";
export const dynamic="force-dynamic";
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){return articleMetadata("blog",(await params).slug);}
export default async function Page({params}:Props){return <ContentArticle kind="blog" slug={(await params).slug}/>;}
