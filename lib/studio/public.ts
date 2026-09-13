import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { query } from "./db";
import type { EntryData,Kind } from "./validation";
export type PublicEntry={id:string;kind:Kind;data:EntryData;updated_at:string;published_at:string};
export const publicEntries=cache(async(kind:Kind,limit=200,offset=0):Promise<PublicEntry[]>=>{
  // Render against committed database revisions. Scheduled publishing and edits
  // remain correct across worker processes, restarts and multiple web instances.
  await connection();
  return query<PublicEntry>(`SELECT e.id,e.kind,r.data,e.updated_at,r.created_at AS published_at FROM studio_entries e JOIN studio_revisions r ON r.id=e.published_revision WHERE e.kind=$1 AND e.deleted_at IS NULL ORDER BY CASE WHEN e.kind IN ('logo','testimonial') THEN COALESCE((r.data->>'order')::integer,0) END ASC,COALESCE(NULLIF(r.data->>'date',''),to_char(r.created_at,'YYYY-MM-DD')) DESC,e.id LIMIT $2 OFFSET $3`,[kind,limit,offset]);
});
export const publicEntry=cache(async(kind:Kind,slug:string)=>{
  await connection();const [row]=await query<PublicEntry>(`SELECT e.id,e.kind,r.data,e.updated_at,r.created_at AS published_at FROM studio_slugs s JOIN studio_entries e ON e.id=s.entry_id JOIN studio_revisions r ON r.id=e.published_revision WHERE s.kind=$1 AND s.slug=$2 AND e.deleted_at IS NULL`,[kind,slug]);return row;
});
export const mediaURL=(id:string,variant="display")=>id?`/media/${id}/${variant}`:"";
