import { requirePage } from "@/lib/studio/access";
import { Shell } from "@/components/studio/Shell";
import { MediaLibrary } from "@/components/studio/MediaLibrary";
export const dynamic="force-dynamic";
export default async function Page(){const actor=await requirePage();return <Shell actor={actor}><div className="studio-heading"><div><h1>Media library</h1><p className="studio-muted">Original artwork and reusable images, all in one place.</p></div></div><MediaLibrary /></Shell>;}
