import { promises as fs } from "node:fs";
import path from "node:path";
import { transaction } from "./db";

export async function migrateStudio() {
  const directory=path.join(process.cwd(),"db");
  const files=(await fs.readdir(directory)).filter(name=>/^\d{3}-[\w-]+\.sql$/.test(name)).sort();
  await transaction(async db=>{
    await db.query("SELECT pg_advisory_xact_lock(934875)");
    await db.query("CREATE TABLE IF NOT EXISTS studio_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");
    for(const file of files){
      const {rowCount}=await db.query("SELECT 1 FROM studio_migrations WHERE name=$1",[file]);
      if(rowCount)continue;
      await db.query(await fs.readFile(path.join(directory,file),"utf8"));
      await db.query("INSERT INTO studio_migrations(name) VALUES($1)",[file]);
    }
  });
}
