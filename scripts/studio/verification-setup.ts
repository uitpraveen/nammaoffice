import "./env";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { Pool } from "pg";
import { randomBytes } from "node:crypto";
for(const key of ["GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","CMS_GOOGLE_WORKSPACE_DOMAIN","CMS_ALLOWED_EMAILS"])delete process.env[key];
const original=new URL(process.env.DATABASE_URL!);if(!["127.0.0.1","localhost"].includes(original.hostname))throw new Error("Verification only runs against a local PostgreSQL server.");
const name=`nammaoffice_verify_${Date.now()}`;const maintenance=new URL(original);maintenance.pathname="/postgres";const control=new Pool({connectionString:maintenance.href});await control.query(`CREATE DATABASE ${name}`);await control.end();
original.pathname=`/${name}`;const dir=await fs.mkdtemp(path.join(os.tmpdir(),"namma-studio-verify-"));await fs.chmod(dir,0o700);
process.env.DATABASE_URL=original.href;process.env.CMS_DATA_DIR=dir;process.env.BETTER_AUTH_URL="http://127.0.0.1:3012";process.env.CMS_MAIL_MODE="local";
const {auth}=await import("../../lib/studio/auth");const {pool,query}=await import("../../lib/studio/db");const {getMigrations}=await import("better-auth/db/migration");await(await getMigrations(auth.options)).runMigrations();await (await import("../../lib/studio/migrations")).migrateStudio();
const users:Record<string,{id:string;email:string;password:string}>={};
for(const role of ["admin","editor","author","other"]){const password=randomBytes(24).toString("base64url"),email=`${role}@studio-test.local`;const result=await auth.api.signUpEmail({body:{email,password,name:`Test ${role}`}});await query('UPDATE "user" SET role=$2,"emailVerified"=true WHERE id=$1',[result.user.id,role==="other"?"author":role]);users[role]={id:result.user.id,email,password};}
await fs.mkdir(path.join(dir,"media"),{recursive:true});
await fs.writeFile(".local/verification.json",JSON.stringify({databaseURL:original.href,dataDir:dir,baseURL:process.env.BETTER_AUTH_URL,users,createdAt:new Date().toISOString()},null,2),{mode:0o600});await pool.end();console.log("Created an isolated verification database and staff accounts. Details saved privately in .local/verification.json.");process.exit(0);
