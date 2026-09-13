import { requirePage } from "@/lib/studio/access";
import { Shell } from "@/components/studio/Shell";
import { Team } from "@/components/studio/Account";
import { redirect } from "next/navigation";
export const dynamic="force-dynamic";
export default async function Page(){const actor=await requirePage();if(actor.role!=="admin")redirect("/admin");return <Shell actor={actor}><Team /></Shell>;}
