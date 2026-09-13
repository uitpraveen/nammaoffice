import { requirePage } from "@/lib/studio/access";
import { Shell } from "@/components/studio/Shell";
import { Security } from "@/components/studio/Account";
export const dynamic="force-dynamic";
export default async function Page(){const actor=await requirePage();return <Shell actor={actor}><Security actor={actor}/></Shell>;}
