import { Pool, type PoolClient, type QueryResultRow } from "pg";
const globalDb = globalThis as unknown as { studioPool?: Pool };
export const pool = globalDb.studioPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  statement_timeout: 15000,
});
if (process.env.NODE_ENV !== "production") globalDb.studioPool = pool;
export async function query<T extends QueryResultRow = QueryResultRow>(sql: string, values: unknown[] = []) {
  if (!process.env.DATABASE_URL) throw new Error("Configure DATABASE_URL and run npm run cms:setup.");
  return (await pool.query<T>(sql, values)).rows;
}
export async function transaction<T>(work: (db: PoolClient) => Promise<T>) {
  const db = await pool.connect();
  try { await db.query("BEGIN"); const result = await work(db); await db.query("COMMIT"); return result; }
  catch (error) { await db.query("ROLLBACK"); throw error; }
  finally { db.release(); }
}
