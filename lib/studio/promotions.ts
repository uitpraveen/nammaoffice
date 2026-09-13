import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { query } from "./db";
import type { EntryData } from "./validation";

export type HeroPromotion = { id:string; data:EntryData };
export const activeHeroPromotion=cache(async():Promise<HeroPromotion|null>=>{
  await connection();
  const [promotion]=await query<HeroPromotion>(`
    SELECT e.id,r.data FROM studio_entries e
    JOIN studio_revisions r ON r.id=e.published_revision
    JOIN studio_media m ON m.id=NULLIF(r.data->>'coverMediaId','')::uuid AND m.status='ready'
    WHERE e.kind='promotion' AND e.deleted_at IS NULL
      AND (NULLIF(r.data->>'startsAt','') IS NULL OR NULLIF(r.data->>'startsAt','')::timestamptz<=now())
      AND NULLIF(r.data->>'endsAt','')::timestamptz>now()
    ORDER BY COALESCE((r.data->>'priority')::int,0) DESC,r.created_at DESC,e.id
    LIMIT 1`);
  return promotion??null;
});
