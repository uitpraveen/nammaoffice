import { requirePage } from "@/lib/studio/access";
import { Shell } from "@/components/studio/Shell";
import { Dashboard } from "@/components/studio/Dashboard";
export const dynamic="force-dynamic";
export default async function Page(){const actor=await requirePage();return <Shell actor={actor}><Dashboard actor={actor}/></Shell>;}
